
  // Build <datalist> from the <select> so you don’t maintain two lists.
    const select = document.getElementById('country');
    const datalist = document.getElementById('countries-list');
    const search = document.getElementById('country-search');

    // Populate datalist with all visible country names
    for (const opt of select.options) {
      if (!opt.value) continue; // skip the placeholder
      const dOpt = document.createElement('option');

    dOpt.value = opt.textContent;
      datalist.appendChild(dOpt);
    }

    // When user picks from the search box, mirror it to the <select>
    search.addEventListener('change', () => {
      const typed = search.value.trim();
      // Find an exact match (case-insensitive) among the select options
      for (const opt of select.options) {
        if (opt.textContent.toLowerCase() === typed.toLowerCase()) {
          select.value = opt.textContent;
          return;
        }
      } 

      // Optional: if no exact match, clear selection
      select.value = '';
    });

    // Keep search input in sync when user changes the <select>
    select.addEventListener('change', () => {
      const selText = select.value || '';
      search.value = selText;
    });


