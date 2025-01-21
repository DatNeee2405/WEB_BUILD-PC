$(document).ready(function() {
    // Lắng nghe sự kiện khi người dùng thay đổi chọn lựa
    $('#CPU').change(function() {
      var totalPrice = 0;
  
      // Duyệt qua tất cả các option đã chọn
      $('#CPU option:selected').each(function() {
        var selectedText = $(this).text().trim();
        
        // Lấy giá từ text trong option
        var price = getPriceFromText(selectedText);
        
        // Thêm giá vào tổng
        totalPrice += price;
      });
  
      // Hiển thị tổng vào trang HTML
      $('#total-price').text('Tổng: ' + totalPrice.toLocaleString() + '₫');
    });
  });
  
  // Hàm lấy giá từ phần text của option
  function getPriceFromText(text) {
    // Kiểm tra nếu giá là "Liên hệ"
    if (text.includes("Liên hệ")) {
      return 0; // Trả về 0 nếu giá là "Liên hệ"
    }
  
    // Tìm giá trong phần text (có dấu ₫) và hỗ trợ dấu phân cách hàng nghìn là dấu chấm
    var match = text.match(/(\d{1,3}(?:\.\d{3})*)(\s*₫)/);
    
    if (match) {
      // Chuyển giá thành số và loại bỏ dấu chấm
      var price = parseFloat(match[1].replace(/\./g, ''));
      return price;
    } else {
      return 0; // Nếu không tìm thấy giá, trả về 0
    }
  }
  