"
---
slug: linux-iscsi
title: iSCSI
authors: Eduardo
tags: [Linux, iSCSI]
displayed_sidebar: sistema_operacional
---

No Linux, é necessário que estes dois pacotes estejam instalados:

- `open-iscsi`
- `multipath-tools`

Os arquivos de configuração do open-iscsi ficam em **/etc/iscsi/**. Devemos configurar os arquivos **initiatorname.iscsi** e **iscsid.conf**.

## Configurando IQN

O IQN (iSCSI Qualified Name) segue o padrão:

- initiatorname: `iqn.yyyy-mm.naming-authority:unique name`

Exemplo:

```shell
InitiatorName=iqn.2021-01.vibra:SHUBT2004:01:af5bf2af245
```

Esse é um exemplo de IQN, configurado conforme a [RFC 3721](https://datatracker.ietf.org/doc/html/rfc3721).

No arquivo **/etc/iscsi/initiatorname.iscsi**, deve-se informar o IQN do servidor que está sendo configurado.

## Configurando os parâmetros para o Target

Outro arquivo que deve ser configurado é o **iscsid.conf**. Nele, estão todos os parâmetros utilizados para descobrir os paths iSCSI da storage.

Caso a storage tenha sido configurada sem protocolo de autenticação, o único parâmetro que precisa ser ajustado é o **node.startup**. Por padrão, ele vem como **manual**. Altere para **automatic** para que, sempre que o servidor reiniciar e o serviço de iSCSI for iniciado, o daemon do open-iscsi conecte automaticamente aos targets.

```conf
node.startup = automatic
```

> **Segurança:**  
> Se for exigido autenticação, configure também:
> 
> ```conf
> node.session.auth.authmethod = CHAP
> node.session.auth.username = <usuario>
> node.session.auth.password = <senha>
> ```

## Habilitar e iniciar serviços

Certifique-se de habilitar e iniciar os serviços necessários para o iSCSI funcionar corretamente:

```shell
systemctl enable --now iscsid open-iscsi
```

## Adicionando os targets

Para adicionar os targets, execute o comando:

```shell
iscsiadm -m discovery -t sendtargets -p 192.168.131.101:3260
```

- `-m discovery`: Módulo do iscsiadm a ser usado;
- `-t sendtargets`: Solicita uma lista de alvos disponíveis para o cliente;
- `-p x.x.x.x:xxxx`: IP e porta que o protocolo irá usar para se conectar.

O resultado deve ser semelhante a:

```shell
iscsiadm -m discovery -t sendtargets -p 192.168.131.101:3260
192.168.131.101:3260,2 iqn.2002-09.com.lenovo:thinksystem.6d039ea0001cf998000000005ff8e47f
192.168.130.101:3260,1 iqn.2002-09.com.lenovo:thinksystem.6d039ea0001cf998000000005ff8e47f
```

Neste caso, há dois targets para a mesma storage. O comando traz a lista e já inclui no banco de dados do open-iscsi.

Repita o procedimento para cada IP iSCSI da storage.

## Ativando a conexão iSCSI

Após adicionar os targets, é necessário ativar as conexões:

```shell
iscsiadm -m node --login
```

O comando irá abrir uma sessão com cada target, permitindo redundância: se um target falhar, o outro continua operando normalmente.

> **Persistência:**  
> Para garantir que os targets conectem automaticamente após reboot, execute:
> 
> ```shell
> iscsiadm -m node -T <nome-do-target> -p <ip>:<porta> --op update -n node.startup -v automatic
> ```

## Verificando sessões e status

Para listar as sessões ativas:

```shell
iscsiadm -m session
```

Se estiver usando multipath, verifique o status dos devices:

```shell
multipath -ll
```

## Desconectar e remover targets

Se precisar remover sessões (ex: troca de storage):

```shell
iscsiadm -m node --logout
iscsiadm -m node --op delete
```

## Configurando Multipath

Se o ambiente utiliza multipath, edite o arquivo `/etc/multipath.conf` com as configurações adequadas para seu storage. Exemplo básico:

```conf
defaults {
    user_friendly_names yes
}

blacklist {
    devnode "^sda"
}
```

Após editar, reinicie o serviço:

```shell
systemctl restart multipath-tools
```

Confira o status dos discos multipath:

```shell
multipath -ll
```

## Troubleshooting e dicas rápidas

- **Verifique status das sessões iSCSI:**
  ```shell
  iscsiadm -m session
  ```
- **Verifique status dos dispositivos multipath:**
  ```shell
  multipath -ll
  ```
- **Cheque logs do serviço:**
  ```shell
  journalctl -u open-iscsi -u iscsid
  dmesg | grep iscsi
  ```

Se aparecerem erros de autenticação, revise as configurações de CHAP ou consulte os logs acima para detalhes do erro.

## Observações finais

- **Firewall:** Verifique se a porta TCP 3260 está liberada.
- **Rede:** Recomenda-se usar VLAN dedicada e segmentação para o tráfego iSCSI.
- **Persistência:** Sempre teste reboot do servidor para garantir que a reconexão automática está funcionando.
- **Documentação:** Mantenha registro dos IQNs, targets, configurações de autenticação e caminhos de rede. Isso facilita troubleshooting e futuras expansões.
- **Atenção com nomes de hosts e identificação de devices** em ambientes com muitos volumes para evitar confusões ou sobrescritas acidentais.
"