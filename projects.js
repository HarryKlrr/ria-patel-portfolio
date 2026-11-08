// Every project on the site lives here. The home page cards and each project's
// own page are built from this list, so adding a project means adding one entry.
//
//   id       short name used in the page link: project.html#<id>
//   fusion   paste the normal Autodesk Fusion share link; the site turns it into a live 3D viewer
//   stl      or: path to an STL file in /models (e.g. exported from SolidWorks); shown in the site's own 3D viewer
//   shortTitle  optional shorter name for the project tabs on the home page
//   tags     short labels shown as pills
//   stats    optional headline numbers for the project page: { value, label }
//            (story sections can also carry a figure: { src, caption })
//   image    card picture, saved in /images (a render or photo of the part)
//   gallery  extra pictures for the project page: { src, caption }
//   story    the write-up, as headed sections; each paragraph is one string
//   status   optional, e.g. 'Planned': shown as a badge and a note, for work not finished yet
//   imageCaption  optional caption shown above the picture on the project page
//   draft    true hides a project from the site until it's ready

window.PROJECTS = [
  {
    id: '3d-printed-prosthetic-socket',
    title: 'Lightweight 3D-printed prosthetic sockets',
    shortTitle: 'Prosthetic sockets',
    field: 'Prosthetics · BEng dissertation',
    year: '2026',
    summary: 'Can 3D-printed plastics replace carbon fibre in transtibial prosthetic sockets? I tested three materials in the lab, validated them with FEA and designed a variable-thickness socket in Fusion 360.',
    tags: ['Prosthetics', 'FEA', '3D printing', 'Materials testing', 'CAD'],
    image: 'images/limb-socket.png',
    fusion: 'https://mail118811.autodesk360.com/g/shares/SH28cd1QT2badd0ea72b3c96e0bec014a0a1',
    facts: {
      Context: 'BEng dissertation',
      Materials: 'Nylon PA12, PETG, polypropylene',
      Methods: 'FDM printing, mechanical testing, FEA',
      Software: 'Fusion 360, SimScale',
    },
    // headline numbers, straight from the write-up
    stats: [
      { value: '<1%', label: 'Gap between simulation and lab results in tension (PA12)' },
      { value: '7.5%', label: 'Gap in three-point bending (PA12)' },
      { value: '>5', label: 'Safety factor under gait loading (PA12)' },
      { value: '40–60%', label: 'Potential cost reduction, with production cut from weeks to hours' },
    ],
    story: [
      {
        heading: 'The brief',
        paragraphs: [
          'For my BEng dissertation I compared three 3D-printing plastics (Nylon PA12, PETG and polypropylene) as a cheaper, faster alternative to carbon fibre for transtibial prosthetic sockets.',
        ],
      },
      {
        heading: 'Testing',
        paragraphs: [
          'I printed test samples with FDM and put them through tensile, bending and compression tests on an Instron universal testing machine, following BS ISO mechanical testing standards (tensile, compression and three-point bending).',
        ],
      },
      {
        heading: 'Design',
        paragraphs: [
          'In Fusion 360 I designed the socket’s variable wall thickness, with thicker walls (4.4 mm) where the loads are highest and thinner, more flexible walls (3.6 mm) around soft-tissue areas.',
        ],
        callouts: [
          { value: '4.4 mm', label: 'Wall thickness where the loads are highest' },
          { value: '3.6 mm', label: 'Thinner, more flexible walls around soft-tissue areas' },
        ],
      },
      {
        heading: 'Simulation',
        paragraphs: [
          'I simulated each test in SimScale to check the results against my lab data. For Nylon PA12 the simulation matched the real tests to within 1% in tension and 7.5% in bending, and it had a safety factor above 5 under gait loading.',
        ],
        figure: {
          src: 'images/socket-fea-pa12.png',
          caption: 'FEA stress plots for the PA12 socket in SimScale: tensile, compression and three-point bend, with simulated vs experimental results.',
        },
      },
      {
        heading: 'Result',
        paragraphs: [
          'Nylon PA12 performed best overall and is my recommended material for the main load-bearing areas of the socket. PETG suits flexible zones, and polypropylene is only suitable for soft-contact areas.',
          'Printing sockets this way could cut costs by 40–60% and reduce production time from weeks to hours.',
        ],
        table: {
          head: ['Material', 'Verdict', 'Where it belongs in the socket'],
          rows: [
            ['Nylon PA12', 'Recommended', 'Main load-bearing areas'],
            ['PETG', 'Suitable', 'Flexible zones'],
            ['Polypropylene', 'Limited', 'Soft-contact areas only'],
          ],
        },
      },
    ],
    gallery: [],
  },

  // SolidWorks part exported to STL. Figures in facts/stats were measured from the model file itself.
  {
    id: 'braided-stent',
    title: 'Braided stent: expanded-state CAD model',
    shortTitle: 'Braided stent',
    field: 'Medical devices · SolidWorks CAD',
    year: '',
    summary: 'A full 3D model of a braided stent in its expanded state: a lattice of crossing helical struts that follows a curved path and changes diameter along its length, built as one solid body in SolidWorks.',
    tags: ['Medical devices', 'SolidWorks', 'Lattice modelling', 'Stent design', 'CAD'],
    image: 'images/expanded-stent.png',
    stl: 'models/expanded-stent.stl',
    facts: {
      Software: 'SolidWorks',
      Geometry: 'Braided helical lattice',
      Envelope: '108 × 122 × 171 mm',
      Output: 'Single solid body, exported to STL',
    },
    stats: [
      { value: '1', label: 'Solid body: every strut and crossing merged, with no loose parts' },
      { value: '~0.5 mm', label: 'Strut thickness, estimated from the model’s volume and surface area' },
      { value: '171 mm', label: 'Longest overall dimension of the curved, expanded stent' },
      { value: '158k', label: 'Facets in the exported mesh, enough to keep every strut crisp' },
    ],
    story: [
      {
        heading: 'The brief',
        paragraphs: [
          'Stents are thin scaffolds that hold a narrowed or blocked passage in the body open. Braided stents, made from struts wound in opposite helical directions, are used where the device has to expand from a small delivery size and then bend with the anatomy, for example in the oesophagus, airways and bowel.',
          'This project models a braided stent in its fully expanded state in SolidWorks, as it would sit inside the body.',
        ],
      },
      {
        heading: 'Design',
        paragraphs: [
          'The body is a lattice of struts running in two opposite helices. Where they cross they form diamond-shaped cells, the feature that lets a braided stent hold a passage open while still flexing along its length.',
          'Rather than a straight cylinder, the stent follows a curved path and its diameter changes along its length, so the model shows the device the way it would actually sit in a bending anatomy.',
        ],
      },
      {
        heading: 'Modelling',
        paragraphs: [
          'A lattice like this is a demanding CAD job. Each strut has to follow a helical path around a curved centreline, and every crossing has to merge cleanly so the result is one solid body rather than hundreds of separate pieces.',
          'The finished part is a single solid with struts of roughly half a millimetre, exported as a 158,000-facet mesh. That gives a clean starting point for meshing in FEA or preparing for manufacture.',
        ],
      },
      {
        heading: 'Next steps',
        paragraphs: [
          'The natural next stage is simulation: radial stiffness and crimping analysis in FEA, so the cell angle and strut size can be tuned to balance the force holding the passage open against flexibility, using the same CAD-to-FEA workflow as my prosthetic socket dissertation.',
        ],
      },
    ],
    gallery: [],
  },

  // Planned project: shown as "Planned" on the site, written as a plan, with no results claimed.
  {
    id: 'smart-socket',
    status: 'Planned',
    title: 'Smart socket: low-cost pressure mapping for prosthetic sockets',
    shortTitle: 'Smart socket',
    field: 'Prosthetics · Sensors · Next project',
    year: '2026',
    summary: 'Building on my dissertation: a 3D-printed PA12 socket fitted with 12 force sensors and a microcontroller that maps pressure at the limb–socket interface in real time, checked against my FEA model.',
    tags: ['Prosthetics', 'Sensors', 'C/C++', 'MATLAB', 'FEA validation', 'Fusion 360'],
    image: 'images/smart-socket-concept.svg',
    imageCaption: 'Concept layout of the planned sensor sites. Colours are illustrative, not measured data',
    facts: {
      Status: 'Planned',
      Hardware: 'FSR sensors, ESP32, 16-channel multiplexer',
      Software: 'C/C++, MATLAB, SimScale, Fusion 360',
      Testing: 'Instron calibration, limb phantom',
    },
    stats: [
      { value: '12', label: 'Planned sensing sites over pressure-tolerant and pressure-sensitive areas' },
      { value: '50 Hz', label: 'Target sampling rate, fast enough to follow a walking gait cycle' },
      { value: '<£100', label: 'Target parts budget, a fraction of commercial pressure-mapping systems' },
      { value: '4', label: 'Milestones, from a single calibrated sensor to cyclic gait loading' },
    ],
    story: [
      {
        heading: 'Why it matters',
        paragraphs: [
          'A badly fitting socket causes pain and skin damage, and is a major reason people stop using their prosthesis. Fit is still judged mostly by the prosthetist’s experience and the patient’s feedback. Systems that measure pressure inside the socket exist, but they are expensive and rarely leave research labs.',
          'My dissertation showed that 3D-printed PA12 can carry the loads in a transtibial socket. The next question is how that socket actually loads the limb, and whether a low-cost sensor system can show it.',
        ],
      },
      {
        heading: 'The plan',
        paragraphs: [
          'I will print a PA12 socket using my variable-wall-thickness design and fit 12 thin force-sensing resistors to its inner wall. They will cover the areas a socket is designed to load (the patellar tendon, medial tibial flare and calf) and the areas it must protect (the tibial crest, fibular head and distal end).',
        ],
      },
      {
        heading: 'Hardware & software',
        paragraphs: [
          'Each sensor sits in a voltage divider read through a 16-channel analogue multiplexer by an ESP32 microcontroller, programmed in C/C++ to sample every site at around 50 Hz and stream the data over USB or Bluetooth. The electronics go in a small enclosure designed in Fusion 360 for 3D printing.',
          'A MATLAB dashboard will turn the readings into a live colour map of the socket and log every test for analysis.',
        ],
      },
      {
        heading: 'Calibration & testing',
        paragraphs: [
          'Force-sensing resistors are non-linear and drift, so each one will be calibrated on the Instron against known loads to build its own force–voltage curve.',
          'Testing will use a 3D-printed residual-limb phantom with a silicone skin layer instead of a person, which avoids the need for ethics approval at this stage. The phantom will be loaded statically at body-weight-equivalent loads, then cyclically to mimic walking. The measured pressure map will be compared with a SimScale FEA model of the same socket under the same load.',
        ],
      },
      {
        heading: 'Milestones',
        paragraphs: [
          '1. Calibrate a single sensor and confirm a repeatable force–voltage curve.',
          '2. Build the 12-sensor array with the live MATLAB dashboard.',
          '3. Run static phantom tests and compare them with the FEA predictions.',
          '4. Run cyclic gait-style loading and write up how well low-cost sensing matches simulation.',
        ],
      },
    ],
    gallery: [],
  },
];

// Fusion share link -> embeddable viewer link
window.fusionEmbed = (link) =>
  link ? link.replace('/g/shares/', '/shares/public/').split('?')[0] + '?mode=embed' : '';
