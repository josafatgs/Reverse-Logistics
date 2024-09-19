
  const cards = document.querySelectorAll(".card");
  const nextButtons = document.querySelectorAll("#next-card");

  // Show the first card on page load
  cards[0].classList.add("show");

  // Event listener for next buttons
  nextButtons.forEach(button => {
      button.addEventListener("click", function() {
          const currentCard = this.getAttribute("data-card");
          const nextCard = parseInt(currentCard) + 1;

          // Hide the current card
          document.getElementById(`card-${currentCard}`).classList.remove("show");

          // Show the next card
          if (document.getElementById(`card-${nextCard}`)) {
              document.getElementById(`card-${nextCard}`).classList.add("show");
          }
      });
  });

