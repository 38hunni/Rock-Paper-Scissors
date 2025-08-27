const display = document.querySelector(".display");
const displayResult = document.querySelector(".display-result");
const buttons = document.querySelectorAll("button");
const operators = ["%", "*", "/", "-", "+"]; // only operators
let output = "";
let result = "";

// Main calculation function
const calculate = (btnValue) => {
	if (btnValue === "=" && output !== "") {
		try {
			result = eval(output.replace("%", "/100"));
		} catch {
			result = "Error";
		}
	} else if (btnValue === "AC") {
		output = "";
		result = "";
	} else if (btnValue === "DEL") {
		output = output.toString().slice(0, -1);
	} else {
		// Prevent multiple operators in sequence
		const lastChar = output.slice(-1);

		if (operators.includes(btnValue)) {
			if (output === "" && btnValue !== "-") {
				// Cannot start with +, *, /, % (except negative numbers with -)
				return;
			}
			if (operators.includes(lastChar)) {
				// Replace last operator with new one
				output = output.slice(0, -1);
			}
		}

		output += btnValue;
	}

	display.value = output;
	displayResult.value = result;
};

// Attach listeners
buttons.forEach((button) => {
	button.addEventListener("click", (e) => calculate(e.target.dataset.value));
});
