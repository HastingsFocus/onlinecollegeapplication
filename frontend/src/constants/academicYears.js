const currentYear = new Date().getFullYear();

const academicYears = [];

for (let year = currentYear; year >= 1950; year--) {
    academicYears.push(year.toString());
}

export default academicYears;