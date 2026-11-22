document.addEventListener('DOMContentLoaded', () => {
  
  const searchInput = document.getElementById('searchInput');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      const query = e.target.value.toLowerCase();
      const cards = document.querySelectorAll('.card');

      cards.forEach(card => {
        const title = card.getAttribute('data-title').toLowerCase();
        if (title.includes(query)) {
          card.style.display = 'block';
        } else {
          card.style.display = 'none';
        }
      });
    });
  }

  const servingsInput = document.getElementById('servings');
  if (servingsInput) {
    const baseServings = parseFloat(servingsInput.value) || 1;

    document.querySelectorAll('.amount').forEach(item => {
      if (!item.hasAttribute('data-base')) {
        item.setAttribute('data-base', item.textContent.trim().replace(',', '.'));
      }
    });

    const updateAmounts = () => {
      const count = parseFloat(servingsInput.value) || 1;

      document.querySelectorAll('.amount').forEach(item => {
        const baseAmount = parseFloat(item.getAttribute('data-base'));
        if (Number.isNaN(baseAmount)) return;

        const newAmount = (baseAmount / baseServings) * count;
        item.textContent = newAmount.toFixed(2).replace(/\.?0+$/, '');
      });
    };

    servingsInput.addEventListener('input', updateAmounts);
  }

  const timerToggleBtn = document.getElementById('timerToggleBtn');
  let timerInterval = null;
  let remainingSeconds = null;

  if (timerToggleBtn) {
    const minutesInput = document.getElementById('timerMinutes');
    const timerDisplay = document.getElementById('timerDisplay');

    const formatTime = (totalSeconds) => {
      const mins = Math.floor(totalSeconds / 60);
      const secs = totalSeconds % 60;
      return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    };

    const setRunningState = (isRunning) => {
      timerToggleBtn.textContent = isRunning ? 'Zastavit' : 'Spustit odpočet';
      timerToggleBtn.classList.toggle('timer-stop', isRunning);
    };

    timerToggleBtn.addEventListener('click', () => {
      if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
        setRunningState(false);
        return;
      }

      if (remainingSeconds === null || remainingSeconds <= 0) {
        remainingSeconds = parseInt(minutesInput.value) * 60;
      }
      if (isNaN(remainingSeconds) || remainingSeconds <= 0) return;

      setRunningState(true);
      timerDisplay.textContent = formatTime(remainingSeconds);

      timerInterval = setInterval(() => {
        remainingSeconds--;
        timerDisplay.textContent = formatTime(remainingSeconds);

        if (remainingSeconds <= 0) {
          clearInterval(timerInterval);
          timerInterval = null;
          setRunningState(false);
          alert('Čas vypršel!');
        }
      }, 1000);
    });

    minutesInput.addEventListener('input', () => {
      if (timerInterval) return;
      const minutes = parseInt(minutesInput.value);
      if (!isNaN(minutes) && minutes > 0) {
        remainingSeconds = minutes * 60;
        timerDisplay.textContent = formatTime(remainingSeconds);
      }
    });
  }

});s