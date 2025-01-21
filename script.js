const cheerio = require('cheerio');
const axios = require('axios');
const fs = require('fs');

// Khởi tạo biến chứa các <option>
let optionsHTML_CPU = '';
let optionsHTML_Mainboard = '';
let optionsHTML_VGA = '';
let optionsHTML_RAM = '';
let optionsHTML_FAN = '';
let optionsHTML_PSU = '';
let optionsHTML_SSD = '';
let optionsHTML_Case = '';


// Số trang tối đa mà bạn muốn lấy dữ liệu (ví dụ, bạn muốn lấy dữ liệu từ 3 trang)
const totalPages_CPU = 3;
const totalPages_Mainboard = 5;
const totalPages_VGA = 4;
const totalPages_RAM = 5;
const totalPages_FAN = 4;
const totalPages_PSU = 3;
const totalPages_SSD = 5;
const totalPages_Case = 5;

const price_CPU = 0;
const price_Mainboard = 0;
const price_VGA = 0;
const price_RAM = 0;
const price_FAN = 0;
const price_PSU = 0;
const price_SSD = 0;
const price_Case = 0; 
// Hàm để lấy sản phẩm từ mỗi trang
const getProductDetails = async (detailUrl) => {
    try {
        const response = await axios.get(detailUrl);
        const $ = cheerio.load(response.data);

        // Lấy thông tin socket (thay đổi selector theo cấu trúc trang web)
        const socket = $('tr:contains("Socket") td').last().text().trim(); // Ví dụ selector
        return socket || 'Thông tin socket không có';
    } catch (error) {
        console.error(`Lỗi khi lấy thông tin chi tiết từ ${detailUrl}:`, error.message);
        return 'Lỗi khi lấy socket';
    }
};

const getProductNames_CPU = async (page) => {
    const url_CPU = `https://memoryzone.com.vn/cpu-may-tinh?page=${page}`;

    try {
        const response = await axios.get(url_CPU);
        const $ = cheerio.load(response.data);

        const productNames = $('h3.product-name');
        const prices = $('div.price-box').find('span.price, span.price-contact'); // Chọn cả 2

        for (let index = 0; index < productNames.length; index++) {
            const name = $(productNames[index]).text().trim();
            const baseDetailUrl = 'https://memoryzone.com.vn';
            const productSlug = $(productNames[index]).find('a').attr('href'); // Lấy slug từ href
            const detailUrl = productSlug ? `${baseDetailUrl}${productSlug}` : null;
            
            // Kiểm tra nếu span.price có tồn tại, nếu không thì lấy từ span.price-contact
            const priceElement = prices.eq(index);
            let price = 'Giá không có';

            // Kiểm tra nếu giá từ span.price có tồn tại
            if (priceElement.length > 0) {
                price = priceElement.text().trim().replace(/\s+/g, ' ');
            }

            // Nếu giá là "Liên hệ" từ span.price-contact, ta không thay thế
            if (price.includes('Liên hệ')) {
                price = price; // Giữ nguyên nếu là "Liên hệ"
            }

            // Lấy thông tin chi tiết (socket)
            const socket = detailUrl ? await getProductDetails(detailUrl) : 'URL chi tiết không có';

            optionsHTML_CPU += `<option value="${name}">${name} - ${price} - Socket: ${socket}</option>\n`;
        }
        console.log(`Đã thu thập dữ liệu từ trang ${page}`);
    } catch (error) {
        console.log(`Lỗi khi lấy dữ liệu từ trang ${page}:`, error);
    }
};


// Hàm để lấy dữ liệu từ tất cả các trang
const collectAllData_CPU = async () => {
    for (let page = 1; page <= totalPages_CPU; page++) {
        await getProductNames_CPU(page);
    }

    // Đọc file index.html để thay đổi
    fs.readFile('index.html', 'utf8', (err, data) => {
        if (err) {
            console.log("Lỗi khi đọc file:", err);
            return;
        }

        // Cập nhật phần tử <select> với id "CPU"
        let updatedHtml = data.replace(
            /(<select[^>]*id="CPU"[^>]*>)(.*?)(<\/select>)/s,
            `$1${optionsHTML_CPU}$3`
        );

        // Ghi lại nội dung mới vào file index.html
        fs.writeFile('index.html', updatedHtml, 'utf8', (err) => {
            if (err) {
                console.error("Lỗi khi ghi file:", err);
            } else {
                console.log("Cập nhật thành công vào index.html!");
            }
        });
    });
};

//__________________________________________________________________________________________________________________________________________
// Hàm để lấy sản phẩm từ mỗi trang
const getProductDetails_Socket = async (detailUrl) => {
    try {
        const response = await axios.get(detailUrl);
        const $ = cheerio.load(response.data);

        // Lấy thông tin socket (thay đổi selector theo cấu trúc trang web)
        const socket = $('tr:contains("CPU hỗ trợ"), tr:contains("Socket CPU") td').last().text().trim(); // Ví dụ selector
        return socket || 'Thông tin socket không có';
    } catch (error) {
        console.error(`Lỗi khi lấy thông tin chi tiết từ ${detailUrl}:`, error.message);
        return 'Lỗi khi lấy socket';
    }
};

const getProductDetails_Ram = async (detailUrl)=>{
	try{
		const response = await axios.get(detailUrl);
		const $ = cheerio.load(response.data);
		const ram = $('tr:contains("Hỗ trợ Ram"), tr:contains("RAM Hỗ trợ") td').last().text().trim();
		return ram || 'Thông tin RAM không có';
	}catch (error) {
        console.error(`Lỗi khi lấy thông tin chi tiết từ ${detailUrl}:`, error.message);
        return 'Lỗi khi lấy RAM';
    }
}

const getProductNames_Mainboard = async (page) => {
    const url_Mainboard = `https://memoryzone.com.vn/mainboard-pc?page=${page}`;

    try {
        const response = await axios.get(url_Mainboard);
        const $ = cheerio.load(response.data);

        const productNames = $('h3.product-name');
        const prices = $('div.price-box').find('span.price, span.price-contact');


        for (let index = 0; index < productNames.length; index++) {
            const name = $(productNames[index]).text().trim();
            const baseDetailUrl = 'https://memoryzone.com.vn';
            const productSlug = $(productNames[index]).find('a').attr('href'); // Lấy slug từ href
            const detailUrl = productSlug ? `${baseDetailUrl}${productSlug}` : null;
            const priceElement = prices.eq(index);
            let price = 'Giá không có';

            // Kiểm tra nếu giá từ span.price có tồn tại
            if (priceElement.length > 0) {
                price = priceElement.text().trim().replace(/\s+/g, ' ');
            }

            // Nếu giá là "Liên hệ" từ span.price-contact, ta không thay thế
            if (price.includes('Liên hệ')) {
                price = price; // Giữ nguyên nếu là "Liên hệ"
            }
            // Lấy thông tin chi tiết (socket)
            const socket = detailUrl ? await getProductDetails_Socket(detailUrl) : 'URL chi tiết không có';
	        const ram = detailUrl ? await getProductDetails_Ram(detailUrl) : 'URL chi tiết không có';

            optionsHTML_Mainboard += `<option value="${name}">${name} - ${price} - Socket: ${socket} - Hỗ trợ Ram: ${ram}</option>\n`;
        }
        console.log(`Đã thu thập dữ liệu từ trang ${page}`);
    } catch (error) {
        console.log(`Lỗi khi lấy dữ liệu từ trang ${page}:`, error);
    }
};
// Hàm để lấy dữ liệu từ tất cả các trang
const collectAllData_Mainboard = async () => {
    for (let page = 1; page <= totalPages_Mainboard; page++) {
        await getProductNames_Mainboard(page);
    }

    // Đọc file index.html để thay đổi
    fs.readFile('index.html', 'utf8', (err, data) => {
        if (err) {
            console.log("Lỗi khi đọc file:", err);
            return;
        }

        // Cập nhật phần tử <select> với id "CPU"
        let updatedHtml = data.replace(
            /(<select[^>]*id="Mainboard"[^>]*>)(.*?)(<\/select>)/s,
            `$1${optionsHTML_Mainboard}$3`
        );

        // Ghi lại nội dung mới vào file index.html
        fs.writeFile('index.html', updatedHtml, 'utf8', (err) => {
            if (err) {
                console.error("Lỗi khi ghi file:", err);
            } else {
                console.log("Cập nhật thành công vào index.html!");
            }
        });
    });
};
//__________________________________________________________________________________________________________________________________________
// Hàm để lấy sản phẩm từ mỗi trang
const getProductNames_VGA = async (page) => {
    const url_VGA  = `https://memoryzone.com.vn/vga?page=${page}`;

    try {
        const response = await axios.get(url_VGA);
        const $ = cheerio.load(response.data);
        const productNames = $('h3.product-name');
        const prices = $('div.price-box').find('span.price, span.price-contact');
        productNames.each((index, element) => {
            const name = $(element).text().trim();

            // Kiểm tra và lấy giá tương ứng nếu tồn tại
            const priceElement = prices.eq(index);
            let price = 'Giá không có';

            // Kiểm tra nếu giá từ span.price có tồn tại
            if (priceElement.length > 0) {
                price = priceElement.text().trim().replace(/\s+/g, ' ');
            }

            // Nếu giá là "Liên hệ" từ span.price-contact, ta không thay thế
            if (price.includes('Liên hệ')) {
                price = price; // Giữ nguyên nếu là "Liên hệ"
            }

            optionsHTML_VGA += `<option value="${name}">${name} - ${price}</option>\n`;
        });
        console.log(`Đã thu thập dữ liệu từ trang ${page}`);
    } catch (error) {
        console.log(`Lỗi khi lấy dữ liệu từ trang ${page}:`, error);
    }
};

// Hàm để lấy dữ liệu từ tất cả các trang
const collectAllData_VGA = async () => {
    for (let page = 1; page <= totalPages_VGA; page++) {
        await getProductNames_VGA(page);
    }

    // Đọc file index.html để thay đổi
    fs.readFile('index.html', 'utf8', (err, data) => {
        if (err) {
            console.log("Lỗi khi đọc file:", err);
            return;
        }

        // Cập nhật phần tử <select> với id "CPU"
        let updatedHtml = data.replace(
            /(<select[^>]*id="VGA"[^>]*>)(.*?)(<\/select>)/s,
            `$1${optionsHTML_VGA}$3`
        );

        // Ghi lại nội dung mới vào file index.html
        fs.writeFile('index.html', updatedHtml, 'utf8', (err) => {
            if (err) {
                console.error("Lỗi khi ghi file:", err);
            } else {
                console.log("Cập nhật thành công vào index.html!");
            }
        });
    });
};

//__________________________________________________________________________________________________________________________________________
// Hàm để lấy sản phẩm từ mỗi trang
const getProductNames_RAM = async (page) => {
    const url_RAM = `https://memoryzone.com.vn/ram-pc?page=${page}`;

    try {
        const response = await axios.get(url_RAM);
        const $ = cheerio.load(response.data);
        const productNames = $('h3.product-name');
        const prices = $('div.price-box').find('span.price, span.price-contact');
        productNames.each((index, element) => {
            const name = $(element).text().trim();

            // Kiểm tra và lấy giá tương ứng nếu tồn tại
            const priceElement = prices.eq(index);
            let price = 'Giá không có';

            // Kiểm tra nếu giá từ span.price có tồn tại
            if (priceElement.length > 0) {
                price = priceElement.text().trim().replace(/\s+/g, ' ');
            }

            // Nếu giá là "Liên hệ" từ span.price-contact, ta không thay thế
            if (price.includes('Liên hệ')) {
                price = price; // Giữ nguyên nếu là "Liên hệ"
            }

            optionsHTML_RAM += `<option value="${name}">${name} - ${price}</option>\n`;
        });
        console.log(`Đã thu thập dữ liệu từ trang ${page}`);
    } catch (error) {
        console.log(`Lỗi khi lấy dữ liệu từ trang ${page}:`, error);
    }
};

// Hàm để lấy dữ liệu từ tất cả các trang
const collectAllData_RAM = async () => {
    for (let page = 1; page <= totalPages_RAM; page++) {
        await getProductNames_RAM(page);
    }

    // Đọc file index.html để thay đổi
    fs.readFile('index.html', 'utf8', (err, data) => {
        if (err) {
            console.log("Lỗi khi đọc file:", err);
            return;
        }

        // Cập nhật phần tử <select> với id "CPU"
        let updatedHtml = data.replace(
            /(<select[^>]*id="RAM"[^>]*>)(.*?)(<\/select>)/s,
            `$1${optionsHTML_RAM}$3`
        );

        // Ghi lại nội dung mới vào file index.html
        fs.writeFile('index.html', updatedHtml, 'utf8', (err) => {
            if (err) {
                console.error("Lỗi khi ghi file:", err);
            } else {
                console.log("Cập nhật thành công vào index.html!");
            }
        });
    });
};


//__________________________________________________________________________________________________________________________________________
// Hàm để lấy sản phẩm từ mỗi trang
const getProductNames_FAN = async (page) => {
    const url_FAN = `https://memoryzone.com.vn/tan-nhiet-fan-case?page=${page}`;

    try {
        const response = await axios.get(url_FAN);
        const $ = cheerio.load(response.data);
        const productNames = $('h3.product-name');
        const prices = $('div.price-box').find('span.price, span.price-contact');
        productNames.each((index, element) => {
            const name = $(element).text().trim();

            // Kiểm tra và lấy giá tương ứng nếu tồn tại
            const priceElement = prices.eq(index);
            let price = 'Giá không có';

            // Kiểm tra nếu giá từ span.price có tồn tại
            if (priceElement.length > 0) {
                price = priceElement.text().trim().replace(/\s+/g, ' ');
            }

            // Nếu giá là "Liên hệ" từ span.price-contact, ta không thay thế
            if (price.includes('Liên hệ')) {
                price = price; // Giữ nguyên nếu là "Liên hệ"
            }

            optionsHTML_FAN += `<option value="${name}">${name} - ${price}</option>\n`;
        });
        console.log(`Đã thu thập dữ liệu từ trang ${page}`);
    } catch (error) {
        console.log(`Lỗi khi lấy dữ liệu từ trang ${page}:`, error);
    }
};

// Hàm để lấy dữ liệu từ tất cả các trang
const collectAllData_FAN = async () => {
    for (let page = 1; page <= totalPages_FAN; page++) {
        await getProductNames_FAN(page);
    }

    // Đọc file index.html để thay đổi
    fs.readFile('index.html', 'utf8', (err, data) => {
        if (err) {
            console.log("Lỗi khi đọc file:", err);
            return;
        }

        // Cập nhật phần tử <select> với id "CPU"
        let updatedHtml = data.replace(
            /(<select[^>]*id="FAN"[^>]*>)(.*?)(<\/select>)/s,
            `$1${optionsHTML_FAN}$3`
        );

        // Ghi lại nội dung mới vào file index.html
        fs.writeFile('index.html', updatedHtml, 'utf8', (err) => {
            if (err) {
                console.error("Lỗi khi ghi file:", err);
            } else {
                console.log("Cập nhật thành công vào index.html!");
            }
        });
    });
};
//__________________________________________________________________________________________________________________________________________
// Hàm để lấy sản phẩm từ mỗi trang
const getProductNames_PSU = async (page) => {
    const url_PSU = `https://memoryzone.com.vn/psu-nguon-may-tinh?page=${page}`;

    try {
        const response = await axios.get(url_PSU);
        const $ = cheerio.load(response.data);
        const productNames = $('h3.product-name');
        const prices = $('div.price-box').find('span.price, span.price-contact');
        productNames.each((index, element) => {
            const name = $(element).text().trim();

            // Kiểm tra và lấy giá tương ứng nếu tồn tại
            const priceElement = prices.eq(index);
            let price = 'Giá không có';

            // Kiểm tra nếu giá từ span.price có tồn tại
            if (priceElement.length > 0) {
                price = priceElement.text().trim().replace(/\s+/g, ' ');
            }

            // Nếu giá là "Liên hệ" từ span.price-contact, ta không thay thế
            if (price.includes('Liên hệ')) {
                price = price; // Giữ nguyên nếu là "Liên hệ"
            }

            optionsHTML_PSU += `<option value="${name}">${name} - ${price}</option>\n`;
        });
        console.log(`Đã thu thập dữ liệu từ trang ${page}`);
    } catch (error) {
        console.log(`Lỗi khi lấy dữ liệu từ trang ${page}:`, error);
    }
};

// Hàm để lấy dữ liệu từ tất cả các trang
const collectAllData_PSU = async () => {
    for (let page = 1; page <= totalPages_PSU; page++) {
        await getProductNames_PSU(page);
    }

    // Đọc file index.html để thay đổi
    fs.readFile('index.html', 'utf8', (err, data) => {
        if (err) {
            console.log("Lỗi khi đọc file:", err);
            return;
        }

        // Cập nhật phần tử <select> với id "CPU"
        let updatedHtml = data.replace(
            /(<select[^>]*id="PSU"[^>]*>)(.*?)(<\/select>)/s,
            `$1${optionsHTML_PSU}$3`
        );

        // Ghi lại nội dung mới vào file index.html
        fs.writeFile('index.html', updatedHtml, 'utf8', (err) => {
            if (err) {
                console.error("Lỗi khi ghi file:", err);
            } else {
                console.log("Cập nhật thành công vào index.html!");
            }
        });
    });
};

//__________________________________________________________________________________________________________________________________________
// Hàm để lấy sản phẩm từ mỗi trang
const getProductNames_SSD = async (page) => {
    const url_SSD = `https://memoryzone.com.vn/ssd?page=${page}`;

    try {
        const response = await axios.get(url_SSD);
        const $ = cheerio.load(response.data);
        const productNames = $('h3.product-name');
        const prices = $('div.price-box').find('span.price, span.price-contact');
        productNames.each((index, element) => {
            const name = $(element).text().trim();

            // Kiểm tra và lấy giá tương ứng nếu tồn tại
            const priceElement = prices.eq(index);
            let price = 'Giá không có';

            // Kiểm tra nếu giá từ span.price có tồn tại
            if (priceElement.length > 0) {
                price = priceElement.text().trim().replace(/\s+/g, ' ');
            }

            // Nếu giá là "Liên hệ" từ span.price-contact, ta không thay thế
            if (price.includes('Liên hệ')) {
                price = price; // Giữ nguyên nếu là "Liên hệ"
            }

            optionsHTML_SSD += `<option value="${name}">${name} - ${price}</option>\n`;
        });
        console.log(`Đã thu thập dữ liệu từ trang ${page}`);
    } catch (error) {
        console.log(`Lỗi khi lấy dữ liệu từ trang ${page}:`, error);
    }
};

// Hàm để lấy dữ liệu từ tất cả các trang
const collectAllData_SSD = async () => {
    for (let page = 1; page <= totalPages_SSD; page++) {
        await getProductNames_SSD(page);
    }

    // Đọc file index.html để thay đổi
    fs.readFile('index.html', 'utf8', (err, data) => {
        if (err) {
            console.log("Lỗi khi đọc file:", err);
            return;
        }

        // Cập nhật phần tử <select> với id "CPU"
        let updatedHtml = data.replace(
            /(<select[^>]*id="SSD"[^>]*>)(.*?)(<\/select>)/s,
            `$1${optionsHTML_SSD}$3`
        );

        // Ghi lại nội dung mới vào file index.html
        fs.writeFile('index.html', updatedHtml, 'utf8', (err) => {
            if (err) {
                console.error("Lỗi khi ghi file:", err);
            } else {
                console.log("Cập nhật thành công vào index.html!");
            }
        });
    });
};
//__________________________________________________________________________________________________________________________________________
// Hàm để lấy sản phẩm từ mỗi trang
const getProductNames_Case = async (page) => {
    const url_Case = `https://memoryzone.com.vn/case-may-tinh?page=${page}`;

    try {
        const response = await axios.get(url_Case);
        const $ = cheerio.load(response.data);
        const productNames = $('h3.product-name');
        const prices = $('div.price-box').find('span.price, span.price-contact');
        productNames.each((index, element) => {
            const name = $(element).text().trim();

            // Kiểm tra và lấy giá tương ứng nếu tồn tại
            const priceElement = prices.eq(index);
            let price = 'Giá không có';

            // Kiểm tra nếu giá từ span.price có tồn tại
            if (priceElement.length > 0) {
                price = priceElement.text().trim().replace(/\s+/g, ' ');
            }

            // Nếu giá là "Liên hệ" từ span.price-contact, ta không thay thế
            if (price.includes('Liên hệ')) {
                price = price; // Giữ nguyên nếu là "Liên hệ"
            }

            optionsHTML_Case += `<option value="${name}">${name} - ${price}</option>\n`;
        });
        console.log(`Đã thu thập dữ liệu từ trang ${page}`);
    } catch (error) {
        console.log(`Lỗi khi lấy dữ liệu từ trang ${page}:`, error);
    }
};

// Hàm để lấy dữ liệu từ tất cả các trang
const collectAllData_Case = async () => {
    for (let page = 1; page <= totalPages_Case; page++) {
        await getProductNames_Case(page);
    }

    // Đọc file index.html để thay đổi
    fs.readFile('index.html', 'utf8', (err, data) => {
        if (err) {
            console.log("Lỗi khi đọc file:", err);
            return;
        }

        // Cập nhật phần tử <select> với id "CPU"
        let updatedHtml = data.replace(
            /(<select[^>]*id="CASE"[^>]*>)(.*?)(<\/select>)/s,
            `$1${optionsHTML_Case}$3`
        );

        // Ghi lại nội dung mới vào file index.html
        fs.writeFile('index.html', updatedHtml, 'utf8', (err) => {
            if (err) {
                console.error("Lỗi khi ghi file:", err);
            } else {
                console.log("Cập nhật thành công vào index.html!");
            }
        });
    });
};

collectAllData_Case();
collectAllData_CPU();
collectAllData_SSD();
collectAllData_PSU();
collectAllData_FAN();
collectAllData_RAM();
collectAllData_VGA();
collectAllData_Mainboard();