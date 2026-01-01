/**
 * Modern Headline Animation (Vanilla JS)
 * Optimized and jQuery-free version
 * Optimized by Hegmata Web - https://hegmata-web.ir
 */

document.addEventListener('DOMContentLoaded', () => {
	// ===================== Animation settings =====================
	const settings = {
		animationDelay: 2500,          // Delay between word changes
		barAnimationDelay: 3800,       // Delay for loading bar animation
		lettersDelay: 50,              // Delay between letters
		typeLettersDelay: 150,          // Delay for type effect letters
		selectionDuration: 500,        // Duration of selection effect
		typeAnimationDelay: 1300,       // typeLettersDelay + selection
		revealDuration: 600,           // Duration of clip reveal
		revealAnimationDelay: 1500     // Delay after clip reveal
	};

	// Initialize all headlines
	initHeadline();

	// ===================== Initialize Headlines =====================
	function initHeadline() {
		const headlines = document.querySelectorAll('.cd-headline');
		headlines.forEach(headline => {
			// Wrap each letter in <i> for animation
			singleLetters(headline.querySelectorAll('b'));

			// Set width for clip and type headlines
			if (headline.classList.contains('clip')) {
				const wrapper = headline.querySelector('.cd-words-wrapper');
				wrapper.style.width = wrapper.offsetWidth + 10 + 'px';
			} else if (!headline.classList.contains('type')) {
				let maxWidth = 0;
				headline.querySelectorAll('.cd-words-wrapper b').forEach(word => {
					if (word.offsetWidth > maxWidth) maxWidth = word.offsetWidth;
				});
				headline.querySelector('.cd-words-wrapper').style.width = maxWidth + 'px';
			}

			// Start first word animation
			setTimeout(() => hideWord(headline.querySelector('.is-visible')), settings.animationDelay);
		});
	}

	// ===================== Wrap letters in <i> =====================
	function singleLetters(words) {
		words.forEach(word => {
			const letters = word.textContent.split('').map(letter => {
				if (word.closest('.rotate-2')) letter = `<em>${letter}</em>`;
				return word.classList.contains('is-visible')
					? `<i class="in">${letter}</i>`
					: `<i>${letter}</i>`;
			});
			word.innerHTML = letters.join('');
			word.style.opacity = 1;
		});
	}

	// ===================== Hide a word =====================
	function hideWord(word) {
		if (!word) return;

		const headline = word.closest('.cd-headline');
		const nextWord = takeNext(word);

		if (headline.classList.contains('type')) {
			// Type effect
			const wrapper = word.parentElement;
			wrapper.classList.add('selected');
			wrapper.classList.remove('waiting');

			setTimeout(() => {
				wrapper.classList.remove('selected');
				word.classList.replace('is-visible', 'is-hidden');
				word.querySelectorAll('i').forEach(l => l.classList.replace('in', 'out'));
			}, settings.selectionDuration);

			setTimeout(() => showWord(nextWord, settings.typeLettersDelay), settings.typeAnimationDelay);

		} else if (headline.classList.contains('letters')) {
			// Letters effect
			const bool = word.querySelectorAll('i').length >= nextWord.querySelectorAll('i').length;
			hideLetter(word.querySelector('i'), word, bool, settings.lettersDelay);
			showLetter(nextWord.querySelector('i'), nextWord, bool, settings.lettersDelay);

		} else if (headline.classList.contains('clip')) {
			// Clip effect
			const wrapper = word.parentElement;
			wrapper.style.transition = `width ${settings.revealDuration}ms`;
			wrapper.style.width = '2px';
			setTimeout(() => {
				switchWord(word, nextWord);
				showWord(nextWord);
			}, settings.revealDuration);

		} else if (headline.classList.contains('loading-bar')) {
			// Loading bar effect
			const wrapper = word.parentElement;
			wrapper.classList.remove('is-loading');
			switchWord(word, nextWord);
			setTimeout(() => hideWord(nextWord), settings.barAnimationDelay);
			setTimeout(() => wrapper.classList.add('is-loading'), settings.barAnimationDelay - 300);

		} else {
			// Default effect
			switchWord(word, nextWord);
			setTimeout(() => hideWord(nextWord), settings.animationDelay);
		}
	}

	// ===================== Show a word =====================
	function showWord(word, duration) {
		if (!word) return;
		const headline = word.closest('.cd-headline');

		if (headline.classList.contains('type')) {
			// Type effect
			showLetter(word.querySelector('i'), word, false, duration);
			word.classList.add('is-visible');
			word.classList.remove('is-hidden');

		} else if (headline.classList.contains('clip')) {
			// Clip effect
			const wrapper = word.parentElement;
			wrapper.style.transition = `width ${settings.revealDuration}ms`;
			wrapper.style.width = word.offsetWidth + 10 + 'px';
			setTimeout(() => hideWord(word), settings.revealAnimationDelay);
		}
	}

	// ===================== Hide a letter =====================
	function hideLetter(letter, word, bool, duration) {
		if (!letter) return;
		letter.classList.replace('in', 'out');

		const nextLetter = letter.nextElementSibling;
		if (nextLetter) setTimeout(() => hideLetter(nextLetter, word, bool, duration), duration);
		else if (bool) setTimeout(() => hideWord(takeNext(word)), settings.animationDelay);
	}

	// ===================== Show a letter =====================
	function showLetter(letter, word, bool, duration) {
		if (!letter) return;
		letter.classList.add('in');
		letter.classList.remove('out');

		const nextLetter = letter.nextElementSibling;
		if (nextLetter) setTimeout(() => showLetter(nextLetter, word, bool, duration), duration);
		else {
			if (word.closest('.cd-headline').classList.contains('type')) {
				setTimeout(() => word.parentElement.classList.add('waiting'), 200);
			}
			if (!bool) setTimeout(() => hideWord(word), settings.animationDelay);
		}
	}

	// ===================== Get next word =====================
	function takeNext(word) {
		const parent = word.parentElement;
		return word.nextElementSibling || parent.children[0];
	}

	// ===================== Get previous word =====================
	function takePrev(word) {
		const parent = word.parentElement;
		return word.previousElementSibling || parent.children[parent.children.length - 1];
	}

	// ===================== Switch words =====================
	function switchWord(oldWord, newWord) {
		oldWord.classList.replace('is-visible', 'is-hidden');
		newWord.classList.replace('is-hidden', 'is-visible');
	}
});
