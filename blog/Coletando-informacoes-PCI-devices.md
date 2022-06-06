---
slug: PCI-Linux-post
title: Como Coletar Modelo de controladora no Linux
authors: Eduardo
tags: [Linux, PCI, Storage]
---

# Introdução

Realizando coleta das placas usadas no linux usando lspci.

<!--truncate-->

## Controladoras de Disco

Para verificar  um processo rotineiro, é verificar modelo/marca de controladora de disco usado em servidores.

### Linux

A forma mais simples de coletar esta informação, é realizando o seguinte:

```
# ls -la /sys/block/sd*
lrwxrwxrwx 1 root root 0 Sep  6 10:01 /sys/block/sda -> ../devices/pci0000:00/0000:00:1f.2/ata3/host2/target2:0:0/2:0:0:0/block/sda
lrwxrwxrwx 1 root root 0 Sep  6 10:01 /sys/block/sdb -> ../devices/pci0000:00/0000:00:1f.2/ata3/host2/target2:0:1/2:0:1:0/block/sdb
lrwxrwxrwx 1 root root 0 Sep  6 10:01 /sys/block/sdc -> ../devices/pci0000:00/0000:00:1f.2/ata4/host3/target3:0:0/3:0:0:0/block/sdc
lrwxrwxrwx 1 root root 0 Sep  6 10:01 /sys/block/sdd -> ../devices/pci0000:00/0000:00:1f.2/ata4/host3/target3:0:1/3:0:1:0/block/sdd
lrwxrwxrwx 1 root root 0 Sep  6 10:01 /sys/block/sde -> ../devices/pci0000:00/0000:00:1e.0/0000:05:05.0/ata5/host4/target4:0:0/4:0:0:0/block/sde
lrwxrwxrwx 1 root root 0 Sep  6 10:04 /sys/block/sdf -> ../devices/pci0000:00/0000:00:1e.0/0000:05:05.0/ata8/host7/target7:0:0/7:0:0:0/block/sdf
```

Com o retono do comando, é necessario validar qual endereço pci corresponde ao disco que se está analisando.

```
lspci | grep -i 1f.2
00:1f.2 IDE interface: Intel Corporation NM10/ICH7 Family SATA Controller [IDE mode] (rev 01)
```

Com isto, foi identificado que a controlado de disco, do device sda por exemplo , é uma Intel Corporation NM10/ICH7
