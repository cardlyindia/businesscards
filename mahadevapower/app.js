/* ==========================================================================
   Mahadeva Power Solutions - Interactive Logic
   ========================================================================== */

// VCard / Contact File Generator
function downloadVCard() {
  const vcardData = [
    'BEGIN:VCARD',
    'VERSION:3.0',
    'FN:Mahadeva Power Solutions',
    'ORG:Mahadeva Power Solutions',
    'TITLE:Power Solutions | Authorized Microtek, Amaron & Exide Dealer',
    'TEL;TYPE=CELL,VOICE:+919496394474',
    'TEL;TYPE=WHATSAPP,VOICE:+919496394474',
    'EMAIL;TYPE=WORK,INTERNET:mkatmahadhevavtra@gmail.com',
    'URL;TYPE=WORK:https://maps.app.goo.gl/PrUBYKwreFVPwfth8',
    'URL;TYPE=Facebook:https://www.facebook.com/share/1ENAdqxdnZ/',
    'URL;TYPE=Instagram:https://www.instagram.com/mahadevapowersolutions?stkn=ZWdwdWJteXJtaGpm',
    'ADR;TYPE=WORK:;;Vithura;Thiruvananthapuram;Kerala;;India',
    'NOTE:⚡ Mahadeva Power Solutions - Since 2010 (16 Years Excellence). Authorized Dealer of Microtek, Amaron & Exide in Vithura. Solar Power, Lithium Batteries, Automotive Batteries, Tubular Batteries, Inverters & UPS.',
    'END:VCARD'
  ].join('\r\n');

  const blob = new Blob([vcardData], { type: 'text/vcard;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', 'Mahadeva_Power_Solutions.vcf');
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

function quickInquiry(serviceName) {
  const message = `Hello Mahadeva Power Solutions,%0A%0AI would like to inquire about *${serviceName}* for my home/business in Vithura. Please share details and pricing.`;
  const whatsappUrl = `https://wa.me/919496394474?text=${message}`;
  window.open(whatsappUrl, '_blank');
}

// Native Share API or Modal
function openShareModal() {
  if (navigator.share) {
    navigator.share({
      title: 'Mahadeva Power Solutions',
      text: 'Mahadeva Power Solutions - Authorized Microtek, Amaron & Exide Dealer in Vithura.',
      url: window.location.href
    }).catch((err) => {
      // Fallback to modal if cancelled or unsupported
      showModal();
    });
  } else {
    showModal();
  }
}

function showModal() {
  const modal = document.getElementById('share-modal');
  modal.classList.add('active');
  renderQRCodeSVG();
}

function closeShareModal() {
  const modal = document.getElementById('share-modal');
  modal.classList.remove('active');
}

function copyProfileLink() {
  navigator.clipboard.writeText(window.location.href).then(() => {
    const btnText = document.getElementById('copy-btn-text');
    const originalText = btnText.innerText;
    btnText.innerText = 'Link Copied! ✓';
    setTimeout(() => {
      btnText.innerText = originalText;
    }, 2000);
  });
}

// Generate simple embedded QR code SVG representation
function renderQRCodeSVG() {
  const svgElem = document.getElementById('qr-svg');
  if (!svgElem) return;

  // A sleek stylized matrix QR code illustration representation pointing to current URL
  svgElem.innerHTML = `
    <rect width="200" height="200" fill="#ffffff" />
    <g fill="#0B132A">
      <!-- Top Left Finder Pattern -->
      <rect x="15" y="15" width="45" height="45" rx="6" />
      <rect x="23" y="23" width="29" height="29" fill="#ffffff" rx="3" />
      <rect x="30" y="30" width="15" height="15" fill="#0066FF" rx="2" />

      <!-- Top Right Finder Pattern -->
      <rect x="140" y="15" width="45" height="45" rx="6" />
      <rect x="148" y="23" width="29" height="29" fill="#ffffff" rx="3" />
      <rect x="155" y="30" width="15" height="15" fill="#0066FF" rx="2" />

      <!-- Bottom Left Finder Pattern -->
      <rect x="15" y="140" width="45" height="45" rx="6" />
      <rect x="23" y="148" width="29" height="29" fill="#ffffff" rx="3" />
      <rect x="30" y="155" width="15" height="15" fill="#0066FF" rx="2" />

      <!-- Data Dots Matrix -->
      <rect x="70" y="20" width="10" height="10" rx="2" fill="#F59E0B" />
      <rect x="85" y="20" width="10" height="10" rx="2" />
      <rect x="110" y="20" width="10" height="10" rx="2" fill="#0066FF" />
      <rect x="70" y="35" width="10" height="10" rx="2" />
      <rect x="95" y="35" width="10" height="10" rx="2" />
      <rect x="120" y="35" width="10" height="10" rx="2" />

      <rect x="20" y="70" width="10" height="10" rx="2" />
      <rect x="35" y="70" width="10" height="10" rx="2" fill="#F59E0B" />
      <rect x="50" y="70" width="10" height="10" rx="2" />
      <rect x="70" y="70" width="10" height="10" rx="2" fill="#0066FF" />
      <rect x="95" y="70" width="25" height="25" rx="4" fill="#F59E0B" />
      <rect x="130" y="70" width="10" height="10" rx="2" />
      <rect x="155" y="70" width="10" height="10" rx="2" />
      <rect x="170" y="70" width="10" height="10" rx="2" />

      <rect x="20" y="95" width="10" height="10" rx="2" />
      <rect x="45" y="95" width="10" height="10" rx="2" fill="#0066FF" />
      <rect x="70" y="95" width="10" height="10" rx="2" />
      <rect x="130" y="95" width="10" height="10" rx="2" fill="#0066FF" />
      <rect x="155" y="95" width="10" height="10" rx="2" />

      <rect x="70" y="120" width="10" height="10" rx="2" fill="#F59E0B" />
      <rect x="95" y="120" width="10" height="10" rx="2" />
      <rect x="110" y="120" width="10" height="10" rx="2" />
      <rect x="140" y="120" width="10" height="10" rx="2" />

      <rect x="70" y="145" width="10" height="10" rx="2" />
      <rect x="95" y="145" width="10" height="10" rx="2" fill="#0066FF" />
      <rect x="120" y="145" width="10" height="10" rx="2" />
      <rect x="155" y="145" width="10" height="10" rx="2" fill="#F59E0B" />
      <rect x="170" y="145" width="10" height="10" rx="2" />

      <rect x="70" y="170" width="10" height="10" rx="2" fill="#0066FF" />
      <rect x="95" y="170" width="10" height="10" rx="2" />
      <rect x="125" y="170" width="10" height="10" rx="2" />
      <rect x="145" y="170" width="10" height="10" rx="2" />
      <rect x="165" y="170" width="10" height="10" rx="2" />
    </g>
  `;
}
