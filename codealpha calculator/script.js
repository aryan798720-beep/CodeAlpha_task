
    function add(value) {
        document.getElementById("result").value += value;
    }

    function calculate() {
        try {
            let exp = document.getElementById("result").value;

            if (!/^[0-9+\-*/.() ]+$/.test(exp)) {
                throw new Error("Invalid input");
            }

            document.getElementById("result").value =
                Function('"use strict"; return (' + exp + ')')();
        } catch {
            document.getElementById("result").value = "Error";
        }
    }

    function clearResult() {
        document.getElementById("result").value = "";
    }
