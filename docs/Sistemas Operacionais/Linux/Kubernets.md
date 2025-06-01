---
slug: linux-kubernets
title: Kubernets
authors: Eduardo
tags: [Linux, Kubernets, power]
displayed_sidebar: sistema_operacional
---
# 4. O K8S

A instalação do Kubernetes é simples e pode ser resolvido com um script e até mesmo ser feita com Ansible, ao menos o setup inicial. Neste caso, fiz manualmente o processo de instalação.
## 4.1. Requisitos base

### 4.1.1. O mínimo

Quando comento com o mínimo, me refiro ao básico que precisa ser feito para que comecemos a instalação e configuração do k8s, seguindo um processo lógico/pratico.

- Configurar ntpd  
- Configurar SSSD (integração com AD ou LDAP)  - se tiver
- Configurar agente de monitoramento  - se tiver
- SSH  
- Sudoers  
- Grupos  
- Usuários  
- Permissões  
## 4.2. Preparando o Linux

Dividi em três seções:

- 4.2.1. Passos para todos os nós  
- 4.2.2. Passos para os masters  
- 4.2.3. Passos para os workers  
### 4.2.1. Passos para todos os nós

Essa é a parte que todo mundo quer pular, mas que, se for mal feita, vira dor de cabeça depois. Aqui vamos garantir o básico, o mínimo pra não ferrar tudo quando o kubeadm começar a trabalhar.

**Verificar MAC address:**
```bash
ip link show
```

**Verificar UUID da máquina:**
```bash
cat /etc/machine-id
```

**Se alguma máquina estiver com o mesmo ID:**
```bash
rm -f /etc/machine-id
systemd-machine-id-setup
```

**Desativar o swap:**
```bash
# Verificando
swapon -s

# Desativando
sudo swapoff -a

# Removendo do fstab
sudo sed -i '/swap/d' /etc/fstab
```

> [!NOTE] Nota  
> Caso queira utilizar a swap, precisa utilizar o seguinte parâmetro:  
> No kubelet (/etc/default/kubelet), adicionar  
> `failSwapOn: false`  
> ou configurar `swapBehavior`.

Se tiver um arquivo `/swap.img` no sistema, apague também, pois isso é um arquivo e ocupa, às vezes, bastante espaço.

#### 4.2.1.1. Ativando overlay e br_netfilter

Explicando rapidamente:

- **OverlayFS**: sistema de arquivos em camadas. Escreve por cima, sem mexer na base. Requisito para os containers ([docs](https://docs.kernel.org/filesystems/overlayfs.html))  
- **br_netfilter**: permite que o tráfego de uma bridge passe pelo netfilter, possibilitando a gerência das interfaces de rede dos containers ([docs](https://ebtables.netfilter.org/documentation/bridge-nf.html))

**Ativando os módulos no boot:**
```bash
cat <<EOF | sudo tee /etc/modules-load.d/k8s.conf
overlay
br_netfilter
EOF
```

**Carregando os módulos:**
```bash
sudo modprobe overlay
sudo modprobe br_netfilter
```

**Verificando os módulos:**
```bash
lsmod | grep overlay
lsmod | grep br_netfilter
```

#### 4.2.1.2. Parâmetros de rede

Por padrão, o Linux ignora o tráfego que passa por bridges. Só que o CNI (plugin de rede) do Kubernetes precisa ver esse tráfego pra funcionar. Se isso não estiver configurado, você vai perder tempo tentando descobrir por que os pods não se comunicam.

**Aqui vai o ajuste obrigatório:**
```bash
cat <<EOF | sudo tee /etc/sysctl.d/k8s.conf
net.bridge.bridge-nf-call-iptables  = 1
net.ipv4.ip_forward                 = 1
net.bridge.bridge-nf-call-ip6tables = 1
EOF
```

**Ativando sem precisar reiniciar o ambiente:**
```bash
sudo sysctl --system
```

#### 4.2.1.3. Configuração dos repositórios necessários

Para o lab, foi necessário instalar as seguintes ferramentas:

- **apt-transport-https**: Utiliza repositórios HTTPS, garantindo downloads mais seguros  
- **ca-certificates**: Gerencia certificados digitais para conexões HTTPS  
- **curl**: Baixa arquivos e dados via terminal  
- **gpg e gnupg2**: Gerenciam chaves criptográficas  
- **software-properties-common**: Ferramenta para adicionar repositórios externos (`add-apt-repository`)

```bash
sudo apt update
sudo apt install -y apt-transport-https ca-certificates curl gpg gnupg2 software-properties-common
```

**Criando a pasta para armazenar as chaves GPG:**
```bash
sudo mkdir -p /etc/apt/keyrings
```

**Adicionando o repositório Docker no Ubuntu:**
```bash
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg

echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
```

**Adicionando o repositório do Kubernetes (v1.31):**
```bash
sudo curl -fsSL https://pkgs.k8s.io/core:/stable:/v1.31/deb/Release.key | sudo gpg --dearmor -o /etc/apt/keyrings/kubernetes-apt-keyring.gpg

echo "deb [signed-by=/etc/apt/keyrings/kubernetes-apt-keyring.gpg] https://pkgs.k8s.io/core:/stable:/v1.31/deb/ /" | sudo tee /etc/apt/sources.list.d/kubernetes.list > /dev/null
```

**Atualizando a base de pacotes:**
```bash
sudo apt update
```

#### 4.2.1.4. Instalar containerd

```bash
sudo apt install -y containerd.io
```

> **containerd.io**: Runtime utilizado pelo Kubernetes para gerenciar e executar containers.
#### 4.2.1.5. Configurar o containerd
O `containerd` é o runtime de containers utilizado pelo Kubernetes para gerenciar a execução de containers em cada nó. Para garantir compatibilidade com o `kubelet`, é necessário configurar o uso de cgroups com `systemd`.

**Passos:**

```bash
sudo mkdir -p /etc/containerd

containerd config default | sudo tee /etc/containerd/config.toml > /dev/null

sudo sed -i 's/SystemdCgroup = false/SystemdCgroup = true/' /etc/containerd/config.toml
```

> [!NOTE]  
> Essa alteração é necessária para que o `kubelet` funcione corretamente com o `containerd` em sistemas que utilizam o `systemd` como gerenciador de serviços (como Ubuntu e Debian). Sem isso, o Kubernetes pode falhar ao iniciar os pods.

Na sequência, o serviço do containerd pode ser iniciado e habilitado com:

```bash
sudo systemctl restart containerd
sudo systemctl enable containerd
```
#### 4.2.1.6. Resumo dos comandos

<details>
<summary><strong>Todos os comandos desta etapa</strong></summary>

```bash
# Verificar MAC address
ip link show

# Verificar UUID da máquina
cat /etc/machine-id

# Caso alguma máquina esteja com o mesmo ID
rm -f /etc/machine-id
systemd-machine-id-setup

# Verificar swap
swapon -s

# Desativar swap
sudo swapoff -a

# Remover swap do fstab
sudo sed -i '/swap/d' /etc/fstab

# (Opcional) Apagar o arquivo de swap se existir
sudo rm -f /swap.img

# Configuração para carregar módulos no boot
cat <<EOF | sudo tee /etc/modules-load.d/k8s.conf
overlay
br_netfilter
EOF

# Carregamento imediato dos módulos
sudo modprobe overlay
sudo modprobe br_netfilter

# Verificação dos módulos
lsmod | grep overlay
lsmod | grep br_netfilter

# Parâmetros para redirecionamento e inspeção de tráfego bridge
cat <<EOF | sudo tee /etc/sysctl.d/k8s.conf
net.bridge.bridge-nf-call-iptables  = 1
net.ipv4.ip_forward                 = 1
net.bridge.bridge-nf-call-ip6tables = 1
EOF

# Aplicar as configurações imediatamente
sudo sysctl --system
```
</details>

### 4.2.2. Passos para os masters

Este lab foi montado com a versão 1.31.8.

Isso é importante, pois na hora de instalar os pacotes, precisamos garantir que isso seja cumprido corretamente para não ter nenhuma situação inesperada que se torne um impeditivo no futuro.

| Componente                | Versão                          | Detalhes                                                              |
| ------------------------- | ------------------------------- | --------------------------------------------------------------------- |
| `kube-apiserver`          | `v1.31.x`                       | Todos os nós de controle (masters) devem rodar exatamente essa versão |
| `kube-controller-manager` | `v1.31.x`                       | Deve estar sincronizado com o `kube-apiserver`                        |
| `kube-scheduler`          | `v1.31.x`                       | Também deve estar na mesma versão                                     |
| `kubelet`                 | `v1.30.x` ou `v1.31.x`          | Pode estar até **uma versão menor atrás**, mas **nunca à frente**     |
| `kube-proxy`              | `v1.30.x`, `v1.31.x`, `v1.32.x` | Pode estar até **uma versão acima ou abaixo**                         |
| `kubectl`                 | `v1.30.x`, `v1.31.x`, `v1.32.x` | Flexível para facilitar administração de diferentes clusters          |
| `kubeadm`                 | **v1.31.x**                     | Use a mesma versão do cluster desejado (neste caso, v1.31.x)          |

> Referência: [Version skew policy | Kubernetes](https://kubernetes.io/releases/version-skew-policy/#supported-versions)

Instalar e configurar os componentes principais do Kubernetes

```bash
sudo apt install -y  kubectl
apt-mark hold kubelet
systemctl enable kubelet
```

- **kubelet**: Agente que roda em todos os nós, responsável por garantir que os containers estejam em execução conforme definido
#### 4.2.2.1 - Inicializando o cluster

Aqui é onde vem uma "pegada" minha para organização, o k8s no geral pede para baixar os arquivos e ir fazendo o `kubectl apply -f qualquercoisa.yml` mas com isso o ambiente fica muito desorganizado, aqui vai uma proposta para melhorar isso.
```
mkdir -p k8s/base/calico \
         k8s/base/metallb \
         k8s/base/ippool \
         k8s/base/networkpolicy \
         k8s/base/rbac \
         k8s/namespaces/devops/networkpolicy \
         k8s/namespaces/devops/rbac \
         k8s/namespaces/sistema-x-prod/networkpolicy \
         k8s/namespaces/sistema-x-prod/rbac \
         k8s/namespaces/modelo/networkpolicy \
         k8s/namespaces/modelo/rbac \
         k8s/scripts
```

Assim cada yml utilizado fica no seu lugar, de forma organizada.

Com isto, vamos começar a realizar o download dos ymls e preparar as coisas, aqui apenas fiz o download dos arquivos para depois aplicar as configurações no cluster

**CNI** - Calico
```bash
curl -sSL https://raw.githubusercontent.com/projectcalico/calico/v3.27.0/manifests/calico.yaml -o "/etc/k8s/calico/calico.yaml"
```
CNI - IPool  Calico
```bash
cat <<EOF > "/etc/k8s/ippool/default-ippool.yaml"
allation/api#operator.tigera.io/v1.Installation
apiVersion: operator.tigera.io/v1
kind: Installation
metadata:
  name: default
spec:
  # Configures Calico networking.
  calicoNetwork:
    ipPools:
    - name: default-ipv4-ippool
      blockSize: 26
      cidr: 10.244.0.0/16
      encapsulation: VXLANCrossSubnet
      natOutgoing: Enabled
      nodeSelector: all()
```

**MetalLB**
```bash
curl -sSL https://raw.githubusercontent.com/metallb/metallb/v0.14.9/config/manifests/metallb-native.yaml  -o "/etc/k8s/metallb/metallb-native.yaml
```

**Ingress** - Nginx
```bash
curl -sSL https://raw.githubusercontent.com/kubernetes/ingress-nginx/controller-v1.12.2/deploy/static/provider/cloud/deploy.yaml  -o "/etc/k8s/ingress/nginx_deploy.yaml

```

Baixando as imagens para o containerd

```bash
kubeadm config images pull --cri-socket unix:///var/run/containerd/containerd.sock
```

**Inicializando o cluster**
Atenção ao podnetwork, quando iniciar o calico, precisará utilizar a mesma subnet, caso contrario os pods não inicializarão.

```bash
kubeadm init --pod-network-cidr=10.244.0.0/16 --cri-socket unix:///var/run/containerd/containerd.sock --v=5
```

Configurando  kubectl para conectar no cluster
``` bash
mkdir -p $HOME/.kube
cp /etc/kubernetes/admin.conf $HOME/.kube/config
chown $(id -u):$(id -g) $HOME/.kube/config
```

verificando cluster
```
kubectl get nodes
```

#### 4.2.2.2 - Configurando o cluster

Caso nao tenha subido de primeira e tudo ficado como ready, valide com:
```
kubectl get nodes

```
### 4.2.3. Passos para os workers

Os workers são os que menos dão trabalho, pois basicamente precisamos instalar o containerd, kubelet e kubeadm e depois incluir no cluster.

Sinceramente, esse deploy do cluster K8s Poderia ser mais Next Next Finish, pra que tanta coisa, poxa, eles poderia fornecer o script que faz isso tudo que estou fazendo na mão rsrssr. mas se quiser tem o kubespray.
