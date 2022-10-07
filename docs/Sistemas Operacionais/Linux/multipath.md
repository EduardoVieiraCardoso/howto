---
slug: linux-iscsi
title: iSCSI
authors: Eduardo
tags: [Linux, iSCSI]
---
# Configurando o Multipath

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

```
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
```

- Configurando os alias do multipath

No comando **multipath -ll** o wwid do disco será exibido, neste caso é o **36d039ea0001cf998000002535ffbd0d6**. Com o multipath, é possivel dar um nome a ele, por boa pratica, recomenda-se utilizar o mesmo nome dado ao volume na storage.

Para configurar o alias deve-se adicionar as seguintes linhas dentro do **/etc/multipath.conf**:
```
 multipaths {
 	multipath {
     	wwid                  36d039ea0001cf998000002535ffbd0d6
         alias   				volume_Edu_Teste
 	}
 }
```
Para cada novo volume mapeado, deve-se configurar uma nova chave de multipath, como no exemplo abaixo:
```
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
```

Após realizar as configurações é necessario reconfigurar o multipath:

```
root@psa# multipathd -k
root@psa# multipathd> reconfigure
root@psa# multipathd> exit
root@psa# multipath -ll
```
Feito este procedimento, o nome do dispositivo, já deve ter sido alterado.