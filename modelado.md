### **Enunciado**
Un camión de caudales debe entregar y recibir dinero de diferentes sucursales bancarias.
Sale de la central vacío y en ningún momento la carga puede superar un importe definido (tampoco ser negativa).
Se busca encontrar el recorrido más corto pasando por todas las sucursales.

Se conoce la distancia de una sucursal cualquiera a cualquier otra y también con la central.

También es conocida como MAX_DINERO la constante de dinero que no puede superar el camión.

Sea SUCURSALES (SUC) la cantidad de sucursales a visitar.

---
### **Objetivo**
Determinar el orden en el cual hay que visitar los cajeros y volver a la sucursal para minimizar la distancia total recorrida.

---
### **Modelado**

**Definición de Variables**

- $Bivalente: Y[i][j] \;\; \forall \, i \in (0,SUC) \;\; \forall \, j \in (0,SUC)$ valdrá 1 si el recorrido de $i$ a $j$ se hace, 0 sino.

- $Constante: W[i][j] \;\; \forall \, i \in (0,SUC) \;\; \forall \, j \in (0,SUC)$ es el la distancia para ir de i a j. Es constante conocida para todos los cajeros y sucursal. 

- $Entera: U[i] \;\; \forall \, i \in (1,SUC)$ va a ser el orden en el cual se visita $i$ en el recorrido.

- $Entera: C[k] \;\; \forall \, i \in (1,SUC)$ va a ser el valor de la caja en el momento k del recorrido.

- $Constante: \Delta C[i] \;\; \forall \, i \in (1,SUC)$ va a ser la variación de dinero al pasar por el cajero $i$. Es constante conocida para todos los $i$.

- $Bivalente: Y_{\Delta C}[k][i] \;\; \forall \,k \in (1, SUC) \;\; \forall \,i \in (1, SUC)$ Será 0 si $U[i] > k$ sino será 1.

**Restricciones**

<u>Propias del viajante</u>

De un cajero cualquiera solo se va a poder ir a un único otro cajero:

$$
\sum_{i=0}^{SUC} Y[i][j] = 1 \;\;\;
\forall\, j \in (0, SUC) \;\;\;
j \neq i
$$

De la misma forma, solo podemos llegar a un cajero particular desde un único otro cajero.

$$
\sum_{j=0}^{SUC} Y[i][j] = 1 \;\;\;
\forall\, i \in (0, SUC) \;\;\;
j \neq i
$$

Tenemos que darle valor a las $U[i]$ utilizando las siguientes restricciones:

$$
U[i] - U[j] + SUC \times Y[i][j] \leq SUC - 1
$$
$$
\forall \;\; i, j \in (1, SUC) \;\; i \neq j
$$

<u>Restricciones de caja</u>

Debemos mantener la caja entre 0 y MAX_DINERO como condicion pedida por el enunciado.

Planteamos que $C[k]$ es una variable que tendrá el valor de la caja en el momento $k$ del recorrido.

\
Entonces: $C[0] = 0$ dado que empezamos con la caja en $0$ desde la central.

Sabemos que $C[k] \ge 0$ por condición de no negatividad de las variables.

\
Debemos darle valor a las bivalentes que nos van a decir si un cajero $i$ es parte del recorrido hasta el orden $k$
$$
k \times Y_{\Delta C}[k][i] \, \leq U[i] \leq \, k + M \times Y_{\Delta C}[k][i]
$$
$$
\forall \, k \in (1, SUC)
$$
$$
\forall \, i \in (1, SUC)
$$
*<p align=center>($M$ constante lo suficientemente grande como para permitirme anular la restricción.)<p>*


El valor de la caja en cualquier momento del recorrido, va a ser la suma de las variaciones (positivas o negativas según la demanda de cada cajero) hasta ese momento
$$
C[k] = \sum_{i=1}^{SUC} Y_{\Delta C}[k][i] \times \Delta C[i]
$$
$$
\forall \, k \in (0, SUC)
$$
Por último, debemos pedir que la caja nunca supere el valor máximo de MAX_DINERO en ningún momento del recorrido
$$
C[k] \leq MAX\_DINERO
$$
$$
\forall \, k \in (0, SUC)
$$

<u>Funcional</u>

Queremos minimizar la distancia recorrida en todo el camino.
$$
Z_{min} = \sum_{i=0}^{SUC} \; \sum_{j=0}^{SUC} \; W[i][j] \times Y[i][j]
$$