import qrcode

def generate_qr_code(text, file_name):
    qr = qrcode.QRCode(
        version=1,
        error_correction=qrcode.constants.ERROR_CORRECT_L,
        box_size=10,
        border=4,
    )
    qr.add_data(text)
    qr.make(fit=True)

    img = qr.make_image(fill_color="black", back_color="white")
    img.save(file_name)

if __name__ == "__main__":
    text = input("Enter text to generate QR code: ")
    file_name = input("Enter file name to save QR code image (with extension like .png): ")
    generate_qr_code(text, file_name)
    print(f"QR code saved as {file_name}")
