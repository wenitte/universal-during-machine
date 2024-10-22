class TuringMachine {
    constructor(transitionRules, blankSymbol = '_', initialState = 'q0', finalStates = new Set()) {
        this.transitionRules = transitionRules;
        this.blankSymbol = blankSymbol;
        this.currentState = initialState;
        this.finalStates = finalStates;
        this.tape = new Map();
        this.headPosition = 0;
    }

    writeInput(inputString) {
        this.tape.clear();
        [...inputString].forEach((symbol, index) => {
            this.tape.set(index, symbol);
        });
        this.headPosition = 0;
        this.currentState = 'q0';
    }

    readSymbol() {
        return this.tape.get(this.headPosition) || this.blankSymbol;
    }

    writeSymbol(symbol) {
        if (symbol !== this.blankSymbol) {
            this.tape.set(this.headPosition, symbol);
        } else {
            this.tape.delete(this.headPosition);
        }
    }

    moveHead(direction) {
        this.headPosition += direction === 'R' ? 1 : -1;
    }

    getTapeContents() {
        if (this.tape.size === 0) return this.blankSymbol;

        const positions = [...this.tape.keys()];
        const minPos = Math.min(...positions);
        const maxPos = Math.max(...positions);

        let result = '';
        for (let i = minPos; i <= maxPos; i++) {
            result += this.tape.get(i) || this.blankSymbol;
        }
        return result;
    }

    step() {
        const currentSymbol = this.readSymbol();
        const key = `${this.currentState},${currentSymbol}`;

        if (!this.transitionRules[key]) {
            return false;
        }

        const [newState, newSymbol, direction] = this.transitionRules[key];
        this.writeSymbol(newSymbol);
        this.moveHead(direction);
        this.currentState = newState;

        return true;
    }

    run(maxSteps = 1000) {
        let steps = 0;
        while (steps < maxSteps) {
            if (this.finalStates.has(this.currentState)) {
                return { success: true, steps };
            }
            if (!this.step()) {
                return { success: false, steps };
            }
            steps++;
        }
        return { success: false, steps };
    }

    // Add a method to get current machine state for visualization
    getState() {
        return {
            tape: this.getTapeContents(),
            headPosition: this.headPosition,
            currentState: this.currentState
        };
    }
}

// Example: Binary increment machine
function createBinaryIncrementTM() {
    const rules = {
        'q0,0': ['q0', '1', 'R'],
        'q0,1': ['q0', '0', 'L'],
        'q0,_': ['qf', '1', 'R']
    };
    return new TuringMachine(rules, '_', 'q0', new Set(['qf']));
}

// Example usage
function runTests() {
    const tm = createBinaryIncrementTM();
    const testInputs = ['0', '1', '11', '101'];

    testInputs.forEach(input => {
        tm.writeInput(input);
        const { success, steps } = tm.run();
        const result = tm.getTapeContents();
        console.log(`Input: ${input}`);
        console.log(`Output: ${result}`);
        console.log(`Steps: ${steps}\n`);
    });
}

// Run the tests
runTests();

// Example of using the machine step by step:
const demonstrateStepByStep = () => {
    const tm = createBinaryIncrementTM();
    tm.writeInput('101');
    
    console.log('Step by step execution:');
    console.log('Initial:', tm.getState());
    
    for (let i = 0; i < 5; i++) {
        if (tm.step()) {
            console.log(`Step ${i + 1}:`, tm.getState());
        } else {
            break;
        }
    }
};

demonstrateStepByStep();
