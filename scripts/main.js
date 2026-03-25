function CreateCalculator() {
    return {
        display: document.querySelector('.screen .result'),
        history: document.querySelector('.screen .count'),
        data: {
            temp: 0,
            result: 0,
            op: '+',
            lastOperand: null
        },

        Start() {
            this.EventListenner();
            this.DeleteDisplay();
            this.DeleteHistory();
        },

        EventListenner() {
            document.querySelector('.buttons').addEventListener('click', (e) => {
                const button = e.target;
                const classlist = button.classList;
                const value = button.innerText;

                if (!classlist.contains('btn')) return;

                if (classlist.contains('btn-clear')) {
                    this.DeleteDisplay();
                    this.DeleteHistory();
                    this.ResetCalculador();
                }

                if (classlist.contains('btn-num')) {

                    const LIMITE = 13;
                    if (this.GetDisplayValue().length >= LIMITE) return;
                    if (value === '.' && this.GetDisplayValue().includes('.')) return;

                    this.AddValue(this.display, value);
                    this.AddValue(this.history, value);
                }

                if (classlist.contains('btn-op')) {

                    if (!this.GetDisplayValue() && value === '-') {
                        this.AddValue(this.display, value);
                    } else {
                        this.SetLastOperand(null); // Reseta o LastOperand para uma nova conta
                        this.DeleteHistory();
                        this.SetOp(value);
                        this.AddValue(this.history, this.GetOp());
                        if (this.GetDisplayValue()) {
                            this.SetTemp(this.GetDisplayValue());
                        }
                        this.DeleteDisplay(this.display);
                    }
                }

                if (classlist.contains('btn-result')) {
                    // Realizar a operação
                    const prevValue = this.GetLastOperand() ?? this.GetDisplayValue();
                    const result = this.Calculate(this.GetOp(), this.GetTemp(), prevValue);
                    this.SetLastOperand(prevValue);
                    
                    // Vizualização do resultado
                    this.DeleteHistory();
                    this.AddValue(this.history, this.GetTemp());
                    this.AddValue(this.history, this.GetOp());
                    this.AddValue(this.history, prevValue);
                    
                    
                    this.SetResult(this.FormatResult(result));
                    this.SetTemp(parseFloat(result));
                    this.DeleteDisplay();
                    this.AddValue(this.display, this.GetResult());
                }

                console.log(`TEMP: ${this.GetTemp()}\nOP: ${this.GetOp()}\nRESULT: ${this.GetResult()}`)
            });
        },

        // Auxiliar Functions

        Calculate(op, value1, value2) {
            value1 = parseFloat(value1);
            value2 = parseFloat(value2);
            const count = {
                '+': value1 + value2,
                '-': value1 - value2,
                '*': value1 * value2,
                '/': value2 !== 0 ? value1 / value2 : 'DIV POR 0',
            }

            return parseFloat(count[op]).toPrecision(3);
        },

        FormatResult(value) {

            value = parseFloat(value);

            if (String(value).length <= 13) return value;

            // Tenta encaixar em notação decimal com menos casas
            const fixed = parseFloat(value.toFixed(5));
            if (String(fixed).length <= 10) return fixed;

            // Último recurso: notação científica
            return value.toExponential(3);
        },

        AddValue(display, value) {
            display.innerHTML += value;
        },

        DeleteDisplay() {
            this.display.innerHTML = '';
        },

        DeleteHistory() {
            this.history.innerHTML = '';
        },

        GetDisplayValue() {
            return this.display.innerHTML;
        },

        ResetCalculador() {
            this.SetTemp(0);
            this.SetResult(0);
            this.SetOp('+')
            this.SetLastOperand(null)
        },

        GetTemp() {
            return this.data.temp;
        },

        GetResult() {
            return this.data.result;
        },

        GetOp() {
            return this.data.op;
        },

        GetLastOperand() {
            return this.data.lastOperand;
        },

        SetTemp(value) {
            this.data.temp = value;
        },

        SetResult(value) {
            this.data.result = value;
        },

        SetOp(value) {
            this.data.op = value;
        },

        SetLastOperand(value) {
            this.data.lastOperand = value;
        }
    };
};

const calculator = CreateCalculator();
calculator.Start();