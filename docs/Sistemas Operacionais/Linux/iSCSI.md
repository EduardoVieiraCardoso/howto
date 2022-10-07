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

{
root@psa:/etc/iscsi# iscsiadm -m discovery -t sendtargets -p 192.168.131.101:3260
192.168.131.101:3260,2 iqn.2002-09.com.lenovo:thinksystem.6d039ea0001cf998000000005ff8e47f
192.168.130.101:3260,1 iqn.2002-09.com.lenovo:thinksystem.6d039ea0001cf998000000005ff8e47f
}

Neste caso, existem dois targets para a mesma storage, e o comando trouxe a lista e já incluiu no seu banco de dados.

O procedimento acima deve ser executado para cada ip iSCSI da storage.

## Ativando conexão iSCSI

Após adicionar os targets, é necessario ativar as conexões.

> root@psa#iscsiadm -m node --login

O comando, irá abrir uma sessão com cada target, de forma que caso um dê problema, o outro continue em operação sem maiores problemas.

## Adicionando host a storage

Para adicionar um host é necessario ir em **home/storage/hosts**, na opção create, usa-se a opção **host**.

<img src="../../../Imagens/manuais-de2000_createhost.png"/>

As opções são auto explicativas, basta selecionar a correspondente ao desejado.

## Configurando o Multipath

Como haverá multiplos caminhos para chegar até o disco na storage, é necessario configurar o multipath para realizar o mapeamento correto do disco, de forma que se um caminho cair o outro entre em ação ou para configurar um balaceamento de carga dentre outras possibilidades, depende de cada projeto e equipamento.

Com o pacote do multipath instalado, primeiramente, deve-se executar o comando **multipath -ll**, ele exibirá todos os discos mapeados e quais caminhos tem para chegar até ele.

```
 root@psa:/etc/iscsi# multipath -ll
 mpatha (36d039ea0001cf998000002535ffbd0d6) dm-1 LENOVO,DE_Series
 size=80G features='3 queue_if_no_path pg_init_retries 50' hwhandler='1 alua' wp=rw
 |-+- policy='service-time 0' prio=50 status=active
 | `- 16:0:0:1 sdc 8:32 active ready running
 `-+- policy='service-time 0' prio=10 status=enabled
   `- 17:0:0:1 sdd 8:48 active ready running
```

Com o multipath, é possivel ajustar como o dado chega até a storage, ativo-ativo, ativo-standby... e por ai vai.

Neste caso, não encontrei nenhuma recomendação da LENOVO para sistemas operacionais como ubuntu, o que se entende que deve-se utilizar nas opções padrões do multipath que já vem pré-configurado.

        device {
                vendor "LENOVO"
                product "DE_Series"
                product_blacklist "Universal Xport"
                path_grouping_policy "group_by_prio"
                path_checker "rdac"
                features "2 pg_init_retries 50"
                hardware_handler "1 rdac"
                prio "rdac"
                failback "immediate"
                no_path_retry 30
        }
- Configurando os alias do multipath

No comando **multipath -ll** o wwid do disco será exibido, neste caso é o **36d039ea0001cf998000002535ffbd0d6**. Com o multipath, é possivel dar um nome a ele, por boa pratica, recomenda-se utilizar o mesmo nome dado ao volume na storage.

Para configurar o alias deve-se adicionar as seguintes linhas dentro do **/etc/multipath.conf**:

 multipaths {
 	multipath {
     	wwid                  36d039ea0001cf998000002535ffbd0d6
         alias   				volume_Edu_Teste
 	}
 }

Para cada novo volume mapeado, deve-se configurar uma nova chave de multipath, como no exemplo abaixo:

 multipaths {
 	multipath {
 		wwid                  36d039ea0001cf998000002535ffbd0d6
 		alias                 volume_Edu_Teste
 	}
	multipath {
 		wwid                  36d039ea0001cf998000002535ffbd0d7
 		alias                 Banco_de_dados
 	}
 	multipath {
 		wwid                  36d039ea0001cf998000002535ffbd0d8
 		alias                 Backup 
 	}
 }

Após realizar as configurações é necessario reconfigurar o multipath:

root@psa# multipathd -k
root@psa# multipathd> reconfigure
root@psa# multipathd> exit
root@psa# multipath -ll

Feito este procedimento, o nome do dispositivo, já deve ter sido alterado.