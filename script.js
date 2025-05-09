// DOM refs
const sscInput = document.getElementById("sscGpa");
const hscInput = document.getElementById("hscGpa");
const goldenContainer = document.getElementById("goldenContainer");
const goldenSsc = document.getElementById("goldenSsc");
const goldenHsc = document.getElementById("goldenHsc");
const form = document.getElementById("feeForm");
const resultSection = document.getElementById("result");
const resultCard = resultSection.querySelector(".result-card");

// show/hide golden checkboxes
sscInput.addEventListener("input", _toggleGolden);
hscInput.addEventListener("input", _toggleGolden);
function _toggleGolden() {
  const s = parseFloat(sscInput.value) === 5;
  const h = parseFloat(hscInput.value) === 5;
  if (s || h) {
    goldenContainer.classList.remove("hidden");
  } else {
    goldenContainer.classList.add("hidden");
    goldenSsc.checked = goldenHsc.checked = false;
  }
}

// department configs
const config = {
  architecture: {
    baseTuition: 598500,
    semesters: 10,
    durationYears: 5,
    regPerSem: 15000,
    devPerSem: 6000,
    labPerSem: 0
  },
  bba: {
    baseTuition: 338000,
    semesters: 12,
    durationYears: 4,
    regPerSem: 10000,
    devPerSem: 4000,
    labPerSem: 0
  },
  cse: {
    baseTuition: 416500,
    semesters: 12,
    durationYears: 4,
    regPerSem: 10000,
    devPerSem: 4000,
    labPerSem: 3500
  },
  english: {
    baseTuition: 303875,
    semesters: 12,
    durationYears: 4,
    regPerSem: 10000,
    devPerSem: 4000,
    labPerSem: 0
  },
  fens: {
    baseTuition: 338938,
    semesters: 12,
    durationYears: 4,
    regPerSem: 10000,
    devPerSem: 4000,
    labPerSem: 3500
  },
  jcms: {
    baseTuition: 262500,
    semesters: 12,
    durationYears: 4,
    regPerSem: 10000,
    devPerSem: 4000,
    labPerSem: 3500
  },
  law: {
    baseTuition: 462000,
    semesters: 8,
    durationYears: 4,
    regPerSem: 15000,
    devPerSem: 6000,
    labPerSem: 0
  },
  pharmacy: {
    baseTuition: 585480,
    semesters: 8,
    durationYears: 4,
    regPerSem: 15000,
    devPerSem: 6000,
    labPerSem: 7000
  }
};

// calculate waiver % based on rules
function getWaiverPct(ssc, hsc, isGoldenSsc, isGoldenHsc, dept) {
  if (dept === "pharmacy") {
    // PHARMACY WAIVER LOGIC
    if (isGoldenSsc && isGoldenHsc) return 0.75;
    if (isGoldenHsc && hsc === 5) return 0.60;
    if (ssc === 5 && hsc === 5) return 0.50;
    if (hsc === 5) return 0.40;
    if (hsc >= 4.80) return 0.25;
    if (hsc >= 4.50) return 0.20;
    if (hsc >= 4.25) return 0.05;
    return 0;
  } else {
    // GENERAL WAIVER LOGIC
    if (isGoldenSsc && isGoldenHsc) return 0.75;
    if ((isGoldenHsc && hsc === 5) || (isGoldenSsc && ssc === 5)) return 0.65;
    if (ssc === 5 && hsc === 5) return 0.60;
    if (hsc === 5) return 0.50;
    if (hsc >= 4.80) return 0.35;
    if (hsc >= 4.50) return 0.25;
    if (hsc >= 4.00) return 0.15;
    return 0;
  }
}


form.addEventListener("submit", e => {
    e.preventDefault();
    const ssc = parseFloat(sscInput.value);
    const hsc = parseFloat(hscInput.value);
    const dept = form.department.value;
    const gender = form.gender.value;
    const isGoldenS = goldenSsc.checked;
    const isGoldenH = goldenHsc.checked;
  
    // eligibility
    if ((ssc < 2.5 || hsc < 2.5) && (ssc + hsc < 6.0)) {
      resultCard.innerHTML = `<strong>Ineligible.</strong><br> Min GPA 2.50 or combined ≥ 6.00 required.`;
      resultSection.classList.remove("hidden");
      return;
    }
  
    const cfg = config[dept];
    const years = cfg.durationYears;

    // waiver and fees
    const w = getWaiverPct(ssc, hsc, isGoldenS, isGoldenH, dept);
    let tuitionAfterWaiver = cfg.baseTuition * (1 - w);
    // 10% extra waiver for female
    if (gender === "female") tuitionAfterWaiver *= 0.90;
  
    // Semester fees for one semester
    const tuitionPerSem = tuitionAfterWaiver / cfg.semesters;
    const regPerSem = cfg.regPerSem;
    const devPerSem = cfg.devPerSem;
    const labPerSem = cfg.labPerSem;
  
    // fixed fees for one semester
    const admission = 25000;
    const ethics = 2000;
  
    // Total cost for one semester
    const totalSemesterCost = tuitionPerSem + regPerSem + devPerSem + labPerSem + admission + ethics;
  
    // Total cost for the 4 years
    const totalTuitionCost = tuitionAfterWaiver;
    const totalRegCost = regPerSem * cfg.semesters;
    const totalDevCost = devPerSem * cfg.semesters;
    const totalLabCost = labPerSem * cfg.semesters;
  
    const totalCostAfterWaiver = totalTuitionCost + totalRegCost + totalDevCost + totalLabCost + admission + ethics;
  
    // render the enhanced result card
    resultCard.innerHTML = `
      <div class="department-info">
        <h3 class="department-heading">Department: ${dept.toUpperCase()}</h3>
        <p><strong>Base Tuition (${years} yr):</strong> ${cfg.baseTuition.toLocaleString()} BDT</p>
        <p><strong>Waiver Applied:</strong> ${(w * 100).toFixed(0)}%${gender === "female" ? " +10% female" : ""}</p>
      </div>
      <hr>
      <h3>Semester Breakdown (For One Semester):</h3>
      <div class="semester-fees">
        <p><strong>Tuition Fee (One Semester):</strong> ${tuitionPerSem.toLocaleString()} BDT</p>
        <p><strong>Registration Fee:</strong> ${regPerSem.toLocaleString()} BDT</p>
        <p><strong>Development Fee:</strong> ${devPerSem.toLocaleString()} BDT</p>
        <p><strong>Lab Fee:</strong> ${labPerSem > 0 ? labPerSem.toLocaleString() : '0 BDT'}</p>
        <p><strong>Admission Fee:</strong> ${admission.toLocaleString()} BDT</p>
        <p><strong>Ethics Fee:</strong> ${ethics.toLocaleString()} BDT</p>
        <hr>
        <p><strong>Total Cost for One Semester:</strong> ${totalSemesterCost.toLocaleString()} BDT</p>
      </div>
      <hr>
      <h3>Total Tuition Fee Breakdown (For ${years} Years):</h3>
      <div class="total-costs">
        <p><strong>Admission Fee:</strong> ${admission.toLocaleString()} BDT</p>
        <p><strong>Ethics Fee:</strong> ${ethics.toLocaleString()} BDT</p>
        <p><strong>Registration Fee (${years} years):</strong> ${totalRegCost.toLocaleString()} BDT</p>
        <p><strong>Lab Fee (${years} years):</strong> ${totalLabCost.toLocaleString()} BDT</p>
        <p><strong>Development Fee (${years} years):</strong> ${totalDevCost.toLocaleString()} BDT</p>
        <p><strong>Base Tuition (${years} years):</strong> ${cfg.baseTuition.toLocaleString()} BDT</p>
        <hr>
        <p><strong>Total Cost After Waiver (${years} years):<h1 style="color:green;"></strong> ${totalCostAfterWaiver.toLocaleString()} BDT</h1></p>
      </div>
    `;
    resultSection.classList.remove("hidden");
    resultSection.scrollIntoView({ behavior: "smooth" });
  });
  