export function initTeam() {
    const madsAge = '1989-09-03';

    const madsAgeElement = document.getElementById("mads-age");

    madsAgeElement.innerHTML = "Age: " + calculateAge(madsAge) + " (" + madsAge + ")";

    function calculateAge(birthdate) {
        const birthDate = new Date(birthdate);
        const currentDate = new Date();
        const ageInMilliseconds = currentDate - birthDate;
        const ageInYears = ageInMilliseconds / (1000 * 60 * 60 * 24 * 365.25);
        const age = Math.floor(ageInYears);
        return age;
    }
}