(() => {
  const KEY = 'hermosa_language';
  const languages = {
    en: { label: 'English', flag: '🇺🇸', code: 'EN' },
    es: { label: 'Español', flag: '🇲🇽', code: 'ES' },
    vi: { label: 'Tiếng Việt', flag: '🇻🇳', code: 'VI' }
  };

  const vi = {
    'Luxury Nail Lounge':'Tiệm nail cao cấp','Call Salon':'Gọi cho tiệm','Appointment Manage':'Quản lý lịch hẹn',
    'McAllen’s Luxury Nail Experience':'Trải nghiệm nail cao cấp tại McAllen','Beauty, refined.':'Vẻ đẹp tinh tế.',
    'Booking, reimagined.':'Đặt lịch theo cách hoàn toàn mới.','Appointment Setup':'Thiết lập lịch hẹn',
    'Contact':'Liên hệ','Representative':'Người đại diện','Guests':'Khách','Group size':'Số người',
    'Services':'Dịch vụ','Each guest':'Từng khách','Schedule':'Lịch hẹn','Date & time':'Ngày và giờ',
    'Confirm':'Xác nhận','Final review':'Kiểm tra cuối','Manage an appointment →':'Quản lý lịch hẹn →',
    'Who is booking?':'Ai đang đặt lịch?','Booking representative':'Người đại diện đặt lịch',
    'One name and phone number will represent the entire appointment.':'Chỉ cần một tên và số điện thoại đại diện cho toàn bộ lịch hẹn.',
    'Full Name *':'Họ và tên *','Phone Number *':'Số điện thoại *','Enter your full name':'Nhập họ và tên',
    'How many guests?':'Có bao nhiêu khách?','Select everyone receiving services, up to seven guests.':'Chọn tổng số người làm dịch vụ, tối đa bảy khách.',
    'Guest':'Khách','Personalize each guest':'Chọn riêng cho từng khách','Choose multiple services and a staff member for each person.':'Mỗi khách có thể chọn nhiều dịch vụ và một thợ riêng.',
    'Guest Display Name':'Tên hiển thị của khách','Selected services':'Dịch vụ đã chọn','Preferred Staff *':'Thợ mong muốn *',
    'Services *':'Dịch vụ *','Select as many as needed':'Có thể chọn nhiều dịch vụ','Search services...':'Tìm dịch vụ...',
    'Select date & time':'Chọn ngày và giờ','Past days and unavailable times are disabled automatically.':'Ngày đã qua và giờ không còn trống sẽ tự động bị khóa.',
    'Selected appointment':'Lịch hẹn đã chọn','Choose a date':'Chọn một ngày','Times will appear after selecting a date.':'Khung giờ sẽ hiện sau khi bạn chọn ngày.',
    'Morning':'Buổi sáng','Afternoon':'Buổi chiều','Final Review':'Kiểm tra cuối','Your appointment is ready.':'Lịch hẹn của bạn đã sẵn sàng.',
    'Booking Name':'Tên người đặt','Phone':'Số điện thoại','Date':'Ngày','Time':'Giờ','Staff:':'Thợ:',
    'Changes & cancellations':'Thay đổi và hủy lịch','Confirm Appointment':'Xác nhận lịch hẹn','Enter your name and phone number.':'Nhập tên và số điện thoại.',
    'Back':'Quay lại','Continue':'Tiếp tục','Luxury nail care in McAllen, Texas.':'Dịch vụ nail cao cấp tại McAllen, Texas.',
    'Admin':'Quản trị','Booking Submitted':'Đã gửi lịch hẹn','Your appointment request was received.':'Yêu cầu đặt lịch của bạn đã được nhận.',
    'Copy Booking Code':'Sao chép mã đặt lịch','Open Appointment Manage':'Mở quản lý lịch hẹn','Customer Portal':'Cổng thông tin khách hàng',
    'Booking Code *':'Mã đặt lịch *','Booking Name *':'Tên người đặt *','Full booking name':'Tên đầy đủ của người đặt',
    'Confirm & View Appointment':'Xác nhận và xem lịch hẹn','Verified Appointment':'Lịch hẹn đã xác minh','Sign Out':'Đăng xuất',
    'Name':'Tên','Date & Time':'Ngày và giờ','Services & Staff':'Dịch vụ và thợ','Guest Name':'Tên khách','Staff':'Thợ',
    'Need to cancel?':'Cần hủy lịch?','Save Appointment Changes':'Lưu thay đổi lịch hẹn','Private Access':'Khu vực riêng tư',
    'Salon Dashboard':'Bảng điều khiển của tiệm','Admin Password':'Mật khẩu quản trị','Enter password':'Nhập mật khẩu','Open Dashboard':'Mở bảng điều khiển',
    'Booking Site':'Trang đặt lịch','Log Out':'Đăng xuất','Live Operations':'Hoạt động trực tiếp','Appointment Dashboard':'Bảng quản lý lịch hẹn',
    'Refresh':'Làm mới','Today’s Appointments':'Lịch hẹn hôm nay','Today’s Guests':'Khách hôm nay','Estimated Revenue':'Doanh thu ước tính',
    'Most Booked':'Được đặt nhiều nhất','Most Requested Staff':'Thợ được yêu cầu nhiều nhất','All statuses':'Tất cả trạng thái',
    'No appointments found.':'Không tìm thấy lịch hẹn.','pending':'đang chờ','confirmed':'đã xác nhận','completed':'đã hoàn thành','cancelled':'đã hủy',
    'Artificial Nails':'Nail bột','Dipping Powder':'Bột nhúng','Manicure Service':'Dịch vụ làm tay','Pedicure Service':'Dịch vụ làm chân',
    'Additional Service':'Dịch vụ thêm','Kid':'Trẻ em','Waxing':'Waxing','Any available staff':'Bất kỳ thợ nào đang trống',
    'Fastest available appointment':'Lịch trống nhanh nhất','Flexible':'Linh hoạt','Unavailable':'Không còn trống','Submitting...':'Đang gửi...',
    'Copied!':'Đã sao chép!','Contact information complete.':'Thông tin liên hệ đã đầy đủ.','Every guest is ready.':'Tất cả khách đã sẵn sàng.',
    'Each guest needs staff and at least one service.':'Mỗi khách cần chọn thợ và ít nhất một dịch vụ.','Schedule selected.':'Đã chọn lịch.',
    'Choose an available date and time.':'Chọn ngày và giờ còn trống.','Review before confirming.':'Kiểm tra trước khi xác nhận.','Language':'Ngôn ngữ'
  };

  const es = {
    'Luxury Nail Lounge':'Salón de uñas de lujo','Call Salon':'Llamar al salón','Appointment Manage':'Administrar cita',
    'McAllen’s Luxury Nail Experience':'La experiencia de uñas de lujo de McAllen','Beauty, refined.':'Belleza refinada.',
    'Booking, reimagined.':'Reservas reinventadas.','Appointment Setup':'Configuración de cita','Contact':'Contacto',
    'Representative':'Representante','Guests':'Clientes','Group size':'Tamaño del grupo','Services':'Servicios','Each guest':'Cada cliente',
    'Schedule':'Horario','Date & time':'Fecha y hora','Confirm':'Confirmar','Final review':'Revisión final','Manage an appointment →':'Administrar una cita →',
    'Who is booking?':'¿Quién hace la reserva?','Booking representative':'Representante de la reserva',
    'One name and phone number will represent the entire appointment.':'Un nombre y número de teléfono representarán toda la cita.',
    'Full Name *':'Nombre completo *','Phone Number *':'Número de teléfono *','Enter your full name':'Ingresa tu nombre completo',
    'How many guests?':'¿Cuántos clientes?','Select everyone receiving services, up to seven guests.':'Selecciona a todas las personas que recibirán servicios, hasta siete clientes.',
    'Guest':'Cliente','Personalize each guest':'Personaliza cada cliente','Choose multiple services and a staff member for each person.':'Elige varios servicios y un profesional para cada persona.',
    'Guest Display Name':'Nombre del cliente','Selected services':'Servicios seleccionados','Preferred Staff *':'Profesional preferido *','Services *':'Servicios *',
    'Select as many as needed':'Selecciona todos los necesarios','Search services...':'Buscar servicios...','Select date & time':'Seleccionar fecha y hora',
    'Past days and unavailable times are disabled automatically.':'Los días pasados y horarios no disponibles se desactivan automáticamente.',
    'Selected appointment':'Cita seleccionada','Choose a date':'Elige una fecha','Times will appear after selecting a date.':'Los horarios aparecerán después de elegir una fecha.',
    'Morning':'Mañana','Afternoon':'Tarde','Final Review':'Revisión final','Your appointment is ready.':'Tu cita está lista.',
    'Booking Name':'Nombre de la reserva','Phone':'Teléfono','Date':'Fecha','Time':'Hora','Staff:':'Profesional:',
    'Changes & cancellations':'Cambios y cancelaciones','Confirm Appointment':'Confirmar cita','Enter your name and phone number.':'Ingresa tu nombre y número de teléfono.',
    'Back':'Atrás','Continue':'Continuar','Luxury nail care in McAllen, Texas.':'Cuidado de uñas de lujo en McAllen, Texas.',
    'Admin':'Administración','Booking Submitted':'Reserva enviada','Your appointment request was received.':'Recibimos tu solicitud de cita.',
    'Copy Booking Code':'Copiar código de reserva','Open Appointment Manage':'Abrir administración de cita','Customer Portal':'Portal del cliente',
    'Booking Code *':'Código de reserva *','Booking Name *':'Nombre de la reserva *','Full booking name':'Nombre completo de la reserva',
    'Confirm & View Appointment':'Confirmar y ver cita','Verified Appointment':'Cita verificada','Sign Out':'Cerrar sesión','Name':'Nombre',
    'Date & Time':'Fecha y hora','Services & Staff':'Servicios y profesional','Guest Name':'Nombre del cliente','Staff':'Profesional',
    'Need to cancel?':'¿Necesitas cancelar?','Save Appointment Changes':'Guardar cambios de la cita','Private Access':'Acceso privado',
    'Salon Dashboard':'Panel del salón','Admin Password':'Contraseña de administración','Enter password':'Ingresa la contraseña','Open Dashboard':'Abrir panel',
    'Booking Site':'Sitio de reservas','Log Out':'Cerrar sesión','Live Operations':'Operaciones en vivo','Appointment Dashboard':'Panel de citas',
    'Refresh':'Actualizar','Today’s Appointments':'Citas de hoy','Today’s Guests':'Clientes de hoy','Estimated Revenue':'Ingresos estimados',
    'Most Booked':'Más reservado','Most Requested Staff':'Profesional más solicitado','All statuses':'Todos los estados','No appointments found.':'No se encontraron citas.',
    'pending':'pendiente','confirmed':'confirmada','completed':'completada','cancelled':'cancelada','Artificial Nails':'Uñas artificiales',
    'Dipping Powder':'Polvo de inmersión','Manicure Service':'Servicio de manicura','Pedicure Service':'Servicio de pedicura','Additional Service':'Servicios adicionales',
    'Kid':'Niños','Waxing':'Depilación','Any available staff':'Cualquier profesional disponible','Fastest available appointment':'La cita disponible más rápida',
    'Flexible':'Flexible','Unavailable':'No disponible','Submitting...':'Enviando...','Copied!':'¡Copiado!','Contact information complete.':'Información de contacto completa.',
    'Every guest is ready.':'Todos los clientes están listos.','Each guest needs staff and at least one service.':'Cada cliente necesita un profesional y al menos un servicio.',
    'Schedule selected.':'Horario seleccionado.','Choose an available date and time.':'Elige una fecha y hora disponibles.','Review before confirming.':'Revisa antes de confirmar.','Language':'Idioma'
  };

  const dicts = { vi, es };
  let lang = localStorage.getItem(KEY) || 'en';
  if (!languages[lang]) lang = 'en';
  const originals = new WeakMap();
  const placeholders = new WeakMap();

  function translateValue(value) {
    if (lang === 'en') return value;
    const trimmed = value.trim();
    const dict = dicts[lang] || {};
    if (dict[trimmed]) return value.replace(trimmed, dict[trimmed]);
    const rules = lang === 'vi' ? [
      [/^Step (\d+) of (\d+)$/, 'Bước $1 trên $2'],[/^Guest (\d+)$/, 'Khách $1'],[/^Guest (\d+) · (\d+)$/, 'Khách $1 · $2'],
      [/^(\d+) guests selected\.$/, 'Đã chọn $1 khách.'],[/^1 guest selected\.$/, 'Đã chọn 1 khách.'],[/^Booking ([A-Z0-9]{6})$/, 'Mã đặt lịch $1']
    ] : [
      [/^Step (\d+) of (\d+)$/, 'Paso $1 de $2'],[/^Guest (\d+)$/, 'Cliente $1'],[/^Guest (\d+) · (\d+)$/, 'Cliente $1 · $2'],
      [/^(\d+) guests selected\.$/, '$1 clientes seleccionados.'],[/^1 guest selected\.$/, '1 cliente seleccionado.'],[/^Booking ([A-Z0-9]{6})$/, 'Reserva $1']
    ];
    for (const [r, replacement] of rules) if (r.test(trimmed)) return value.replace(trimmed, trimmed.replace(r, replacement));
    return value;
  }

  function translateNode(node) {
    if (node.nodeType === Node.TEXT_NODE) {
      if (!node.nodeValue.trim() || node.parentElement?.closest('#hermosaLanguageWidget')) return;
      if (!originals.has(node)) originals.set(node, node.nodeValue);
      node.nodeValue = translateValue(originals.get(node));
      return;
    }
    if (node.nodeType !== Node.ELEMENT_NODE && node.nodeType !== Node.DOCUMENT_FRAGMENT_NODE) return;
    if (node.closest?.('#hermosaLanguageWidget')) return;
    if ((node instanceof HTMLInputElement || node instanceof HTMLTextAreaElement) && node.hasAttribute('placeholder')) {
      if (!placeholders.has(node)) placeholders.set(node, node.placeholder);
      node.placeholder = translateValue(placeholders.get(node));
    }
    const walker = document.createTreeWalker(node, NodeFilter.SHOW_TEXT | NodeFilter.SHOW_ELEMENT);
    let n;
    while ((n = walker.nextNode())) translateNode(n);
  }

  function refresh() { translateNode(document.body); updateWidget(); document.documentElement.lang = lang; }
  function setLanguage(next) { lang = next; localStorage.setItem(KEY, next); refresh(); }

  function updateWidget() {
    const w = document.getElementById('hermosaLanguageWidget'); if (!w) return;
    w.querySelector('.lang-flag').textContent = languages[lang].flag;
    w.querySelector('.lang-code').textContent = languages[lang].code;
    w.querySelector('.lang-title').textContent = lang === 'vi' ? 'Ngôn ngữ' : lang === 'es' ? 'Idioma' : 'Language';
    w.querySelectorAll('[data-lang]').forEach(b => b.classList.toggle('selected', b.dataset.lang === lang));
  }

  function createWidget() {
    const w = document.createElement('div'); w.id = 'hermosaLanguageWidget';
    w.innerHTML = `<button class="lang-fab" type="button"><span class="lang-flag"></span><b class="lang-code"></b><span>⌃</span></button>
      <div class="lang-menu"><div class="lang-title">Language</div>${Object.entries(languages).map(([k,v])=>`<button type="button" data-lang="${k}"><span>${v.flag}</span><strong>${v.label}</strong><i>✓</i></button>`).join('')}</div>`;
    document.body.appendChild(w);
    w.querySelector('.lang-fab').onclick = () => w.classList.toggle('open');
    w.querySelectorAll('[data-lang]').forEach(b => b.onclick = () => { setLanguage(b.dataset.lang); w.classList.remove('open'); });
    document.addEventListener('click', e => { if (!w.contains(e.target)) w.classList.remove('open'); });
    updateWidget();
  }

  function addStyle() {
    const s = document.createElement('style'); s.textContent = `
      #hermosaLanguageWidget{position:fixed;right:16px;bottom:calc(16px + env(safe-area-inset-bottom));z-index:9999;font-family:Montserrat,sans-serif}
      #hermosaLanguageWidget .lang-fab{height:50px;min-width:76px;padding:0 14px;display:flex;align-items:center;justify-content:center;gap:8px;border:1px solid rgba(215,173,101,.45);border-radius:999px;color:#fffaf2;background:linear-gradient(135deg,rgba(215,173,101,.16),rgba(255,255,255,.04)),rgba(20,16,15,.95);box-shadow:0 16px 45px rgba(0,0,0,.48);backdrop-filter:blur(18px);cursor:pointer}
      #hermosaLanguageWidget .lang-flag{font-size:19px}#hermosaLanguageWidget .lang-code{font-size:11px;letter-spacing:.08em}
      #hermosaLanguageWidget .lang-menu{position:absolute;right:0;bottom:60px;width:215px;padding:10px;border:1px solid rgba(215,173,101,.3);border-radius:18px;background:rgba(20,16,15,.98);box-shadow:0 24px 70px rgba(0,0,0,.55);opacity:0;visibility:hidden;transform:translateY(10px) scale(.97);transition:.22s}
      #hermosaLanguageWidget.open .lang-menu{opacity:1;visibility:visible;transform:none}.lang-title{padding:7px 10px 10px;color:#aaa09a;font-size:9px;font-weight:700;letter-spacing:.14em;text-transform:uppercase}
      #hermosaLanguageWidget .lang-menu button{width:100%;min-height:47px;padding:8px 10px;display:grid;grid-template-columns:28px 1fr 20px;align-items:center;gap:8px;border:1px solid transparent;border-radius:11px;color:#fffaf2;text-align:left;background:transparent;cursor:pointer}
      #hermosaLanguageWidget .lang-menu button:hover{background:rgba(255,255,255,.045)}#hermosaLanguageWidget .lang-menu button.selected{border-color:rgba(215,173,101,.34);background:rgba(215,173,101,.1)}
      #hermosaLanguageWidget .lang-menu button>span{font-size:19px}#hermosaLanguageWidget .lang-menu button strong{font-size:11px}#hermosaLanguageWidget .lang-menu button i{opacity:0;color:#f3d59a;font-style:normal}#hermosaLanguageWidget .lang-menu button.selected i{opacity:1}
      @media(max-width:680px){#hermosaLanguageWidget{right:11px;bottom:calc(11px + env(safe-area-inset-bottom))}#hermosaLanguageWidget .lang-fab{height:47px;min-width:69px;padding:0 11px}}
    `; document.head.appendChild(s);
  }

  window.HermosaI18n = { setLanguage, getLanguage:()=>lang, refresh };
  document.addEventListener('DOMContentLoaded', () => {
    addStyle(); createWidget(); refresh();
    new MutationObserver(ms => ms.forEach(m => m.addedNodes.forEach(translateNode))).observe(document.body,{childList:true,subtree:true});
  });
})();
