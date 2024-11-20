function scrollToCurrentTimeSlot() {
    const currentTime = new Date();
    const currentHour = currentTime.getHours();
    const currentMinute = currentTime.getMinutes();
 
    const timeSlots = document.querySelectorAll('.time-slot');
  
    timeSlots.forEach(timeSlot => {
      const startTime = timeSlot.getAttribute('data-start-time');
      const endTime = timeSlot.getAttribute('data-end-time');
      const [startHour, startMinute] = startTime.split(':').map(Number);
      const [endHour, endMinute] = endTime.split(':').map(Number);
  
      if (currentHour >= startHour && currentHour <= endHour) {
        timeSlot.scrollIntoView({ behavior: 'smooth' });
        return; 
      }
    });
  }
  
window.onload = scrollToCurrentTimeSlot();

document.getElementById("search-input").addEventListener("keydown", function(event) {
  if (event.key === "Enter") {
    scrollToMatch();
  }
});


function scrollToMatch() {
  const searchText = document.getElementById("search-input").value.trim().toLowerCase();

  if (!searchText) {
    return; // No search term, do nothing
  }

  const menuPostDescElements = document.querySelectorAll(".menu-post-desc, .malayalam");

  for (const element of menuPostDescElements) {
    const elementText = element.textContent.toLowerCase();

    if (elementText.includes(searchText)) {
      element.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }
  }
  swal("No Item found !", "");

}