---
slug: linux-iscsi
title: iSCSI
authors: Eduardo
tags: [Linux, iSCSI]
displayed_sidebar: sistema_operacional
---

No linux é necessario que estes dois pacotes estejam instalados:

- open-iscsi
- multipath-tools

Os arquivos de configuração do open-iscsi ficam em **/etc/iscsi/**, devemos configurar os arquivos **initiatorname.iscsi**  ,**iscsid.conf**.

## Configurando IQN

- initiatorname. -  iqn.yyyy-mm.naming-authority:unique name

> InitiatorName= iqn.2021-01.vibra:SHUBT2004:01:af5bf2af245

Este é um exemplo de nome para o IQN, que foi configuraod de acordo com a RFC 3721

Dentro de **/etc/iscsi/initiatorname.iscsi** deve-se informar o iqn do servidor que está sendo configurado.

## Configurando os parametros para o Target

Outro arquivos que deve ser configurado, é o **iscsid.conf**. Dentro dele, está todos os parametros que seram utilizados para descobrir os paths iSCSI da storage.

Caso, a storage tenha sido configurada sem protocolo de autenticação, o unico parametro que deve ser configurado é o **node.startup**, por padrão ele vem com configurado como **No**, basta configurar para **Yes**. Desta forma, toda vez que o servidor reiniciar  e o serviço de iSCSI for iniciado, o daemon do open-iscsi irá conectar automaticamente nos targets.

## Adicionando os targets

Para adicionar os targets basta executar o seguinte comando:

> **iscsiadm -m discovery -t sendtargets -p 192.168.131.101:3260**

- -m discovery: Modulo do iscsiadm que será usado;
- -t sendtargets: Solicita uma lista de alvos disponiveis para o cliente 
- -p x.x.x.x:xxxx: IP e porta que o protocolo irá usar para se conectar.

O resultado do comando deverá ser semelhante a:

```
root@psa:/etc/iscsi# iscsiadm -m discovery -t sendtargets -p 192.168.131.101:3260
192.168.131.101:3260,2 iqn.2002-09.com.lenovo:thinksystem.6d039ea0001cf998000000005ff8e47f
192.168.130.101:3260,1 iqn.2002-09.com.lenovo:thinksystem.6d039ea0001cf998000000005ff8e47f
```

Neste caso, existem dois targets para a mesma storage, e o comando trouxe a lista e já incluiu no seu banco de dados.

O procedimento acima deve ser executado para cada ip iSCSI da storage.

## Ativando conexão iSCSI

Após adicionar os targets, é necessario ativar as conexões.

> root@psa#iscsiadm -m node --login

O comando, irá abrir uma sessão com cada target, de forma que caso um dê problema, o outro continue em operação sem maiores problemas.

As opções são auto explicativas, basta selecionar a correspondente ao desejado.