window.HERMOSA_MENU = {
  "Artificial Nails": [
    ["Full Set — Full Set", "$50"], ["Full Set — Fill In", "$45"],
    ["Powder Color — Full Set", "$50"], ["Powder Color — Fill In", "$45"],
    ["Overlay Acrylic — Full Set", "$45"], ["Overlay Acrylic — Fill In", "$45"],
    ["Pink & White / Ombre — Full Set", "$60"], ["Pink & White / Ombre — Fill In", "$45"],
    ["White / Pearl Tip — Full Set", "$45"], ["White / Pearl Tip — Fill In", "$40"],
    ["Gel X — Full Set", "$50"], ["Gel X — Fill In", "$40"]
  ],
  "Dipping Powder": [["Dip Overlay","$45"],["Dip with Tip","$50"],["Dip French Tip","$55"]],
  "Manicure Service": [["Manicure","$20"],["Manicure + Polish","$25"],["Manicure + Shellac","$35"]],
  "Pedicure Service": [["Basic Pedicure","$32"],["Spa Pedicure","$37"],["Deluxe Pedicure","$47"],["Deluxe Package","$57"],["Avocado Deluxe","$62"],["Jelly Deluxe","$72"]],
  "Additional Service": [["Change Polish","$15"],["Change Shellac","$25"],["Shellac with Service","$15"],["Nail Repair","$5 & Up"],["Remove + Service","$5"],["Remove Only","$10"],["French","$5 & Up"],["Chrome","$10 & Up"],["Cat Eyes","$10 & Up"],["Long Nail","$5 & Up"],["Coffin / Almond / Stiletto Shape","$5"]],
  "Kid": [["Kid Manicure + Polish","$15"],["Kid Manicure + Shellac","$25"],["Kid Pedicure + Polish","$27"],["Kid Pedicure + Shellac","$37"],["Kid Shellac Only","$15"],["Kid Polish Only","$10"]],
  "Waxing": [["Eyebrow","$10"],["Lip","$6"],["Whole Face","$35"],["Under Arm","$15"],["Side Burn","$10 & Up"]]
};

Object.keys(window.HERMOSA_MENU).forEach(category => {
  window.HERMOSA_MENU[category] = window.HERMOSA_MENU[category].map(([name, price]) => ({name, price, category}));
});

window.HERMOSA_STAFF = [
  {name:"Any available staff", description:"Fastest available appointment"},
  {name:"Chau", description:"Pedicure, Manicure, and Nail Design"},
  {name:"Lee", description:"Pedicure, Manicure, Nail Design, and Waxing"},
  {name:"Helen", description:"Pedicure, Manicure, and Waxing"},
  {name:"Ana", description:"Pedicure, Manicure, and Nail Design"},
  {name:"Marissa", description:"Pedicure, Manicure, and Nail Design"},
  {name:"Evelyn", description:"Pedicure, Manicure, and Nail Design"}
];
