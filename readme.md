Thanh toán :
 - get api /payment/create_payment --> trả về đường link của vn pay
 - nhận trả về từ vnpay qua http://localhost:4200/profile/payment?abcxyz --> gửi các parameter đến /payment/vnpay_ipn
	-- trạng thái trả về 00 là thành công, khác 00 thì báo có lỗi xảy ra


Hiển thị danh sách người dùng đã thanh toán
admin/listpayment

quản lý user có trả về id

create user dùng lại api của register
edit user truyền trong body : id, email, nickname,password, dateCreate, plan


edit category truyền lên id,category
delelte category truyền lên id




