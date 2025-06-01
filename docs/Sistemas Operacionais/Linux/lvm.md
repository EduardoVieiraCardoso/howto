
---
slug: linux-lvm
title: LVM
authors: Eduardo
tags: [Linux, LVM]
displayed_sidebar: sistema_operacional
---

# Introdução ao LVM

É muito comum encontrar inúmeras dúvidas na internet quando trata-se de redimensionamento de partição, principalmente por parte do pessoal que está começando a trabalhar com Linux. Geralmente, durante a instalação do sistema operacional, muitos não sabem quanto de espaço alocar em cada partição. Muitas vezes, delimitam um espaço aparentemente suficiente para determinado diretório, mas que acaba não suportando a quantidade de arquivos, como é comum acontecer com o diretório `/var`.

O diretório `/var` é o local onde ficam os arquivos de log, cache, entre outros. Quando esta partição fica cheia, o sistema pode apresentar lentidão e constantes mensagens de aviso. Surge, então, a dúvida: como resolver esse problema? Limpar o cache? Formatar? Utilizar uma ferramenta para redimensionar o disco?

Neste tutorial, abordaremos o uso do **LVM (Logical Volume Manager)**, uma ferramenta poderosa e bastante utilizada por administradores de sistemas Linux.

> **Nota:** Por segurança, é comum alocar diretórios importantes em partições separadas. Assim, caso o sistema seja corrompido, pode-se restaurar ou formatar apenas a partição afetada, reduzindo o risco de perda total de dados.

## Vantagens e Desvantagens do LVM

### Vantagens

- Facilita o redimensionamento de partições/filesystems.
- Permite adicionar discos e redimensionar de forma transparente para o sistema.
- Não exige desmontar partições para redimensionamento.
- Suporte a snapshots para backup automático.

### Desvantagens

- Se um dos discos que compõem o grupo falhar, pode ocorrer perda de dados.
- **Faça backups**, independentemente do tipo de particionamento utilizado.

## Conceitos Fundamentais

O LVM organiza o armazenamento em três camadas principais:

- **PV (Physical Volume)**: Partição ou disco inteiro.
- **VG (Volume Group)**: Agrupamento de PVs.
- **LV (Logical Volume)**: Partição lógica criada dentro de um VG.

Com essa estrutura, é possível criar, redimensionar e mover volumes de maneira muito mais flexível.

## Instalação

Distribuições como Fedora já utilizam LVM por padrão. Outras, como o Ubuntu, exigem configuração manual.

> Dica: se for utilizar LVM durante a instalação, separe a partição `/boot`, pois o gerenciador de boot pode não conseguir acessá-la se estiver dentro de um grupo LVM.

## Exemplificando

### Cenário sem LVM

```
/home  -> 8.5 GB
/var   -> 2.5 GB
/usr   -> 6.0 GB
swap   -> 2.0 GB
```

Caso `/home` fique cheio, as opções são:

1. Backup, redimensionamento e restauração.
2. GParted (com os riscos de corromper outras partições).

### Com LVM

É possível mover dados entre volumes, redimensionar e adicionar novos discos, com flexibilidade.

## Mão na Massa

### Criando partições LVM

Exemplo:

```
/dev/sdb1  -> 8 GB  (tipo 8e - Linux LVM)
/dev/sdc1  -> 8 GB  (tipo 8e - Linux LVM)
```

### Criando volumes físicos

```bash
pvcreate /dev/sdb1 /dev/sdc1
pvdisplay
```

### Criando grupo de volumes

```bash
vgcreate grupo-disco /dev/sdb1 /dev/sdc1
vgdisplay
```

### Criando volumes lógicos

```bash
lvcreate -L 6G -n disco-bkp grupo-disco
lvcreate -L 6G -n disco-var grupo-disco
```

### Formatando e configurando fstab

```bash
mkfs.ext4 /dev/grupo-disco/disco-bkp
mkfs.ext4 /dev/grupo-disco/disco-var

echo "/dev/mapper/grupo--disco-disco--bkp /home/bkp auto defaults 0 2" >> /etc/fstab
echo "/dev/mapper/grupo--disco-disco--var /var/log auto defaults 0 2" >> /etc/fstab

mount -av
```

Pronto! Agora você já pode usar LVM para gerenciar seus discos com muito mais flexibilidade e segurança.
