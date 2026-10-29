cd root -> start-dfs.sh
jps
jps



export JAVA_HOME=/usr/lib/jvm/java-17-openjdk-amd64
export HADOOP_HOME=$HOME/hadoop-3.4.2
export PATH=$PATH:$HADOOP_HOME/bin:$HADOOP_HOME/sbin


start-dfs.sh
jps
start-yarn.sh
jps

hdfs dfs -cat /ecommerce/output/user_product_counts/part-* | head -20 -> It is used to see the actual output produced by your Hadoop MapReduce job
