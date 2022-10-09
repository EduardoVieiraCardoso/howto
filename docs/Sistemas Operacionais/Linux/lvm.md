---
slug: linux-lvm
title: LVM
authors: Eduardo
tags: [Linux, LVM]
displayed_sidebar: sistema_operacional
---
# Introdução ao LVM

É muito comum encontrar inúmeras dúvidas na internet quando trata-se de redimensionamento de partição, principalmente por parte do pessoal que esta começando a trabalhar com Linux, pois geralmente quando estão instalando o sistema operacional, os mesmos não sabem direito o quanto de espaço devem colocar em cada partição, e em muitos os casos delimitam um espaço satisfatório para acomodar determinado diretório, porém as vezes este espaço disponibilizado acaba não suportando a grande quantidade de arquivos gerados dentro dele, como por exemplo o /var.

O diretório /var é o local onde ficam os arquivos de log, arquivos de cache e etc…. Quando esta partição fica cheia é bem provável que o sistema fique com uma certa lentidão, além de constantes mensagens informando ao usuário que a partição /var esta quase cheia. E é aí que vem a duvida, como posso resolver este problema(limpando o cache….)? formatar o computador? Utilizar uma ferramenta para redimensionar o disco? Neste tutorial irei abordar uma ferramenta bem conhecida entre os administradores de TI, que é o LVM.

Nota: Por segurança é muito comum alocar diretórios importantes para o sistema ou para o usuário em partições diferentes, pois caso sistema seja corrompido, pode-se restaurar ou formatar apenas a partição defeituosa, pois assim diminui-se o risco de perder todos os dados de uma só vez.

## **Vantagens e desvantagens do uso de LVM**

- **Vantagens**
  - Com o uso do LVM muito mais simples de redimensionar uma partição/filesystem.
  - Flexibilidade, pois assim é mais fácil adicionar um novo disco e redimensionar o mesmo de forma transparente para o sistema;
  - Não é necessário desmontar uma partição para redimensionar a mesma.
  - Criar volumes lógicos de backup automático _(snapshots)_
- **Desvantagens**
  - Confiabilidade. Quando se utiliza a técnica de LVM é necessário escolher HD's que são de boa qualidade para evitar surpresas, como por exemplo, se tivermos 4 HD's que estão juntos em um grupo e caso apenas um deles falhar, você pode perder todo o seu _filesystem_. **FAÇA**** BACKUP INDEPENDENTE DO TIPO DE PARTIÇÃO QUE VOCÊ USA.**

## **O que é o LVM? e como ele funciona?**

Solucionar problemas de armazenamento, esta é a principal função do **gerenciador de volumes lógicos** ( Tradução livre de _LVM_ = _logical volume management_). Adivinhe o que um gerenciador de volume lógico faz?...Gerencia um volume lógico?!, OBVIO!!! mas e o que é um volume lógico?... Esta é a pergunta chave, volume lógico, este termo será explicado posteriormente neste artigo, já vamos chegar lá, primeiro vamos entender a sua estrutura, pois o volume lógico ficará mais visível e será mais fácil compreencível.

É de extrema necessidade entender primeiro o seu funcionamento para depois colocar o _LVM_ em pratica, pois esta ferramenta pode facilitar muito sua vida quando utilizada da forma correta. Por tanto, vamos aos conceitos iniciais.

O LVM é divido em 3 camadas volume físico ( **PV** ), grupo de volume ( **VG** ) e volume lógico ( **LV** ):

- **PV ( Phisical Volume - Volume físico) =** Volume físico nada mais é que uma partição de um disco ou um disco inteiro, por exemplo (/dev/sdb1 , /dev/sdb2 , /dev/sdc1, /dev/sde1 e por aí vai...)

- **VG ( Volume Group - Grupo de volume ) =** Grupo de volumes, é simplesmente o agrupamento de volumes físicos PV, por exemplo ( /sdb1+/sde1=grupo de volume).

- **LV ( Logical Volume - Volume Lógico ) =** O volume lógico é uma parte de um VG, onde o mesmo pode ser utilizado como qualquer outra partição física e pode ser redimensionado sem a necessidade de ser desmontado.

Estes são os principais conceitos, no decorrer do tutorial irei explicar alguns outros conceitos tão importantes quanto. (logo abaixo coloquei uma representação gráfica, para que fique mais visível)



## **Formas de instalação**

Em algumas distribuições Linux as partições são do tipo LVM por padrão, ou seja, quando o computador é formatado o sistema automaticamente coloca as partições criadas com o tipo **8e (Linux LVM) e cria os VP's,VG's e LV's** como é o caso do fedora, isto não acontece em distribuições baseadas em Debian, como por exemplo Ubuntu. Sendo assim temos a primeira forma de instalação DURANTE A FORMATAÇÃO DO SISTEMA.

### **Vantagens**

- É possível redimensionar o tamanho de partições, como por exemplo /home, /var, /tmp sem a necessidade de desmontar as mesmas primeiro ….
- É possível fazer o backup automático (snapshot) de partições especificas com o LVM.
- Sempre que for fazer LVM já na instalação crie a partição /boot separada do sistema, por que se ele estiver atrelado a algum grupo o gestor de inicialização não poderá acessa - lo para inicializar o SO.

### **Desvantagens**

- É praticamente a mesma citada logo acima, se o HD estiver defeituoso, pode causar sérios problemas ao seu servidor ou seu desktop, podendo causar indisponibilidade. Porem é bom saber que se for identificado algum problema com qualquer um dos discos, é possível mover todas as informações de um volume logico para outro volume lógico do mesmo grupo, podendo então substituir o HD defeituoso sem nenhum problema.

Ok, tudo bem, mas e se eu tiver criado partições padrão, ainda é possível redimensioná-las? sim ,até é possível, mas você não poderá exceder a capacidade total do disco ou diminuir uma outra partição/filesystem para colocar mais espaço em uma outra partição(Confuso?). Por exemplo: Em um cenário sem LVM:

Vamos exemplificar: Exemplo de disco
```
/home -----\> 8.5GB

/var --------\> 2.5 GB

/usr --------\> 6.0 GB

swap ------\> 2.0 GB
```
Digamos que não temos mais espaço disponível, e meu /home está abarrotado de informações, o que eu posso fazer?,bom , no caso de o meu /home não participar do LVM, eu vejo basicamente duas opções:

1ª - Realizar o backup dos dados, reformatar a partição para o tamanho desejado e copiar as informações do BKP para dentro da partição (/home) redimensionada. conforme o cenário colocado isso até seria feito de forma bem rápida, pois para encher 8.5 GB é um processo rápido, porem agora imagine um /home de mais de 300 GB, provavelmente iria levar o dobro do tempo, tanto para exportar as informações quanto para importar os dados para o novo disco e ou partição.

2ª Utilizar software de gerenciamento de partição, como por exemplo o Gparted, pois bem, o gparted funciona e muito bem, porem para que se possa aumentar o espaço de uma partição/filesystem é necessário ter espaço livre no disco, mas e se não tiver espaço, o que você vai fazer? Liberar espaço de outra partição? Correr o risco de corromper o filesystem de uma outra partição e ter que reformatar a mesma posteriormente para corrigir o erro?.... Sendo assim a solução mais viável seria comprar um HD maior e refazer tudo.

Ainda preciso explicar os benefícios de criar partições em um ambiente LVM durante instalação do SO? Caso sim segue o link.

## **Mão na massa**

Nós, seres humanos, não transitamos na dimensão do tempo, e sendo assim que não conseguimos prever o mesmo… Tendo isto em mente, quando montares um servidor, seja lá qual for o uso que dará para ele, pense na **escalabilidade.** O uso do LVM irá te auxiliar muito no futuro, pois quando o servidor de arquivos estiver cheio de BKP's importantes, quando o servidor de e-mail estiver lotado… Como você fará para solucionar este problema ?, Muitas vezes servidores como estes não devem parar, devido a sua fundamental importância para a empresa. Sendo assim, antes de montar o server considere o uso do LVM, RAID para auxiliar você quando o seu desktop ou servidor estiver com pouca capacidade de armazenamento... Sendo assim vamos lá.

Este passo a passo de agora em diante será direto e sem rodeios, mostrando os comando e explicando algumas coisas fundamentais. Teremos outro artigo ainda que abordará o uso do LVM, desperdício de espaço em disco e por ai vai…

### ** Criando Partições do tipo LVM**

Minha maquina virtual possui três discos:
```
/dev/sda ---\> 80GB

/dev/sda1 ----\> 5GB ---- /

/dev/sda2 ---\> 37GB ---\> espaço livre

/dev/sda5 ---\> 28GB ----\> /home

/dev/sda6 ---\> 5,6GB ---\> /usr

/dev/sda7 ---\> 1,9GB ---\> swap

/dev/sda8 ---\> 2,3GB ---\> /var

/dev/sdb ---\> 8GB

Sem partições

/dev/sdc ---\> 8GB

Sem partições
```
Primeiro de tudo identifique os discos que você irá trabalhar. Comando **Fdisk -l**



Aqui, podemos observar a existência de três dispositivos de armazenamento SD **A** , SD **B** , SD **C.**

Como o SDA já está formato e modo padrão ( **83** Linux), não recomento a alteração e mudança de **83 LINUX** para **Linux LVM (8e)**, para simplesmente evitar problemas.

Em cada disco irei criar uma única partição que irá ocupar todo o disco disponível.

O comando que irei utilizar para criar a as partições é **fdisk /dev/sd\*** (no seu sistema troque o \* pelo disco que você irá utilizar.)



Basicamente a configuração para o particionamento é este, certifique-se de que você tenha alterado o tipo de partição para 8e Linux LVM , pois assim o LVM utilizará a auto detecção para saber quais partições ele deve utilizar quando dermos o comando **pvscan**. **(Repita este mesmo procedimento em todos os discos em que você deseja que trabalhe com LVM).**

Agora quando eu executo o comando fdisk -l o meu cenário é este:
```
\<SAIDA OMITIDA\>

/dev/sdb ---\> 8GB

Device Boot start end Sectors size ID type

/dev/sdb1 2048 16777215 16775168 8G 8e Linux LVM

\<SAIDA OMITIDA\>

/dev/sdc ---\> 8GB

Device Boot start end Sectors size ID type

/dev/sdc1 2048 8390655 8388608 8G 8e Linux LVM

\<SAIDA OMITIDA\>
```
Tendo as partições criadas , agora é a hora de criar os volumes Físicos para coloca-los em um grupo, este procedimento é bem rápido, basta dar o comando **pvcreat** e o caminho de cada partição. 

Pronto. Caso você possua um disco com mais de uma partição bastá indicar a mesma no comando, por exe: **pvcreat /dev/sdb1 /dev/sdb2** ….

Caso queira conferir, execute o comando **pvdisplay,** onde serão mostrados todos os detalhes dos volumes físicos existentes.

Criados os volumes físicos, agora é a hora de agrupar os mesmos, para isto iremos criar um **vg** chamado grupo-disco. Utilizarei o comando **vgcreat.**

Após a criação do grupo vamos emitir o comando **vgdisplay** , para exibir todos os grupos existentes no sistema:

Bom, aí esta o grupo que acabamos de criar, informações relevantes sobre os dodos informados no print acima: 

- **Metadata Areas =** Quantidade de discos/partições utilizadas no grupo.

- **VGsize =** Tamanho total do grupo, no caso temos ~8G + ~4G = ~11,99GB

- **PE size =** Tamanho dos blocos (4MB é padrão)

- **Total PE =** O tamanho total do grupo é de 11,99GB, esses 11,99GB é divido em pequenos blocos de 4MB, ou seja, se dividirmos 12280MB÷4MB veremos que é possível criar um volume no máximo de 3070 blocos de 4MB, que é mais ou menos 11,99GB, ou pode-se criar pequenos volumes lógicos agrupando PE's, que é o que eu irei fazer posteriormente.

- **Alloc PE / Size =** exibe a quantidade de blocos/espaço alocado.

- **Free PE / size =** exibe a quantidade de blocos/espaço **não** alocado, ou seja, espaço livre.

Estas são informações são extremamente relevantes para o próximo passo, que é a criação dos volumes lógicos: para criar utilizarei o comando **lvcreat** : 

Existem duas opções, você pode indicar ao sistema que quer uma partição lógica de 6GB ou pode indicar a quantidade de blocos que deseja utilizar. No meu caso eu indiquei que quero um volume com tamanho exato de 6GB. Caso não queira realizar o calculo simples, você pode trocar o **-l {Quant. bloco}** por **-L**** {quant. GB,MB,KB...}.**

Repeti o mesmo procedimento e criei mais um volume com 1535 PE's (6GB) com o nome de disco-var. 

Uma coisa que não falei, é que uma das vantagens do LVM é a atribuição de nomes a volumes, isso facilita e muito na hora de realizar uma manutenção ou quando acontecer algum erro acontecer no sistema.

para finalizar, devemos formatar a nova partição e configurar o fstab para montar a mesma automaticamente.



Note que utilizei o diretório /dev/mapper, o LVM irá utilizar este diretório para mapear os grupos e volumes lógicos, estes mesmo caminhos serão anexados no **fstab.**

Para finalizar então, irei inserir duas linhas e configuração no fstab

echo "/dev/mapper/grupo--disco-disco--bkp /home/bkp auto 2 2 " \>\> /etc/fstab

echo "/dev/mapper/grupo--disco-disco--var /var/log auto 2 2 " \>\> /etc/fstab

e por ultimo um **mount -av** para montar todas as partições do fstab

8
