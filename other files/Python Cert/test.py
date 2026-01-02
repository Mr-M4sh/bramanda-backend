
def notice():
    msg ="you exam is here at 3 rd december !!!!"
    print(msg)
    def inner_notice():
       global new_msg 
       new_msg = "you exam is postphoned"
     
    inner_notice()
    
notice()
print(new_msg)