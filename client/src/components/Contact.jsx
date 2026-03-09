import { useEffect, useMemo, useState } from 'react';

const normalizePhoneToWhatsApp = (phone = '') => {
  const digits = String(phone).replace(/\D/g, '');
  if (!digits) return '';

  if (digits.startsWith('256')) return digits;
  if (digits.startsWith('0')) return `256${digits.slice(1)}`;
  if (digits.startsWith('7') || digits.startsWith('1')) return `256${digits}`;
  return digits;
};

export default function Contact({ product }) {
  const [owner, setOwner] = useState(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchOwner = async () => {
      try {
        const userId = product?.userRef;
        if (!userId) return;
        const apiBase = import.meta.env.VITE_API_URL || '';
        const res = await fetch(`${apiBase}/api/user/${userId}`);
        const data = await res.json();
        setOwner(data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchOwner();
  }, [product]);

  const sellerName = product?.sellerName || owner?.username || 'Seller';
  const sellerEmail = product?.sellerEmail || owner?.email || '';
  const sellerPhone = product?.contactPhone || owner?.phoneNumber || owner?.phone || '';

  const whatsappLink = useMemo(() => {
    const waNumber = normalizePhoneToWhatsApp(sellerPhone);
    if (!waNumber) return '';
    const body = encodeURIComponent(message || `Hi ${sellerName}, I am interested in your ${product?.name}.`);
    return `https://wa.me/${waNumber}?text=${body}`;
  }, [sellerPhone, sellerName, product?.name, message]);

  const mailLink = useMemo(() => {
    if (!sellerEmail) return '';
    return `mailto:${sellerEmail}?subject=${encodeURIComponent(`Inquiry: ${product?.name || 'Product'}`)}&body=${encodeURIComponent(message)}`;
  }, [sellerEmail, product?.name, message]);

  if (!owner && !product?.sellerEmail && !product?.contactPhone) return null;

  return (
    <div className='flex flex-col gap-1.5 mt-2 bg-emerald-950 text-white p-2 rounded-xl'>
      <p className="text-[9px] font-black text-emerald-200 uppercase tracking-widest pl-1">
        Inquire with <span className='text-white'>{sellerName}</span>
      </p>
      <textarea
        name='message'
        id='message'
        rows='1'
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type a message..."
        className='w-full border border-white/10 p-2 rounded-lg bg-white/5 text-white placeholder-gray-400 font-bold text-xs outline-none focus:border-emerald-400 transition-all'
      />

      <div className="grid grid-cols-2 gap-1.5">
        <a
          href={whatsappLink || '#'}
          target="_blank"
          rel="noreferrer"
          className={`text-center py-2 uppercase rounded-lg font-black text-[9px] tracking-wider transition-all shadow-lg ${whatsappLink ? 'bg-green-600 hover:bg-green-500 text-white' : 'bg-gray-500/40 text-gray-200 cursor-not-allowed pointer-events-none'}`}
        >
          WhatsApp
        </a>
        <a
          href={mailLink || '#'}
          className={`text-center py-2 uppercase rounded-lg font-black text-[9px] tracking-wider transition-all shadow-lg ${mailLink ? 'bg-emerald-600 hover:bg-emerald-500 text-white' : 'bg-gray-500/40 text-gray-200 cursor-not-allowed pointer-events-none'}`}
        >
          Email
        </a>
      </div>
    </div>
  );
}
