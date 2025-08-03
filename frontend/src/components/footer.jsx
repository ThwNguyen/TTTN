import React from 'react';

export default function Footer() {
  return (
    <footer style={styles.footer}>
      <div style={styles.info}><b>Địa chỉ:</b> Đại học Công nghiệp Hà Nội</div>
      <div style={styles.info}><b>Liên hệ:</b> nguyenthithu270603@gmail.com</div>
      <div style={styles.info}><b>Điện thoại:</b> 036 851 7314</div>
    </footer>
  );
}

const styles = {
  footer: {
    width: '100%',
    background: '#e5c49b',
    color: '#222',
    textAlign: 'center',
    padding: '18px 0 12px 0',
    fontSize: 16,
    fontFamily: 'Segoe UI, Arial, sans-serif',
    borderTop: '2px solid #bfa06e',
    position: 'fixed',
    left: 0,
    bottom: 0,
    zIndex: 10,
  },
  info: {
    margin: '2px 0',
  },
};
