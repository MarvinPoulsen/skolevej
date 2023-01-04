import React, { FC } from 'react';

interface TravelguideProps {
    instructions: string[];
    isActive: boolean;
    onClose: () => void;
}

const Travelguide: FC = (props: TravelguideProps) => {

    const instructions = props.instructions;
    const travelGuide: Element[] = [];
    for (const [index,instruction] of instructions.entries()) {
        const textArr = instruction.split(',');
        const lastTextArr = textArr[textArr.length - 1].split(' ');
        const distance = parseFloat(lastTextArr[lastTextArr.length - 2]);
        let refinedInstruction: string = '';
        if (distance < 0.001) {
            refinedInstruction = textArr[0];
        } else if (distance < 0.5) {
            lastTextArr[lastTextArr.length - 2] = String(distance * 1000);
            lastTextArr[lastTextArr.length - 1] = 'meter';
            const withSpaces = lastTextArr.join(' ');
            if (textArr[0].split(' ')[0] === 'fortsæt') {
                refinedInstruction =
                    textArr[0] +
                    ' ' +
                    lastTextArr[lastTextArr.length - 2] +
                    ' ' +
                    lastTextArr[lastTextArr.length - 1];
            } else {
                refinedInstruction = textArr[0] + ' og' + withSpaces;
            }
        } else {
            lastTextArr[lastTextArr.length - 2] = distance.toFixed(1);
            const withSpaces = lastTextArr.join(' ');
            refinedInstruction = textArr[0] + ' og' + withSpaces;
        }
        travelGuide.push(
            <p className="panel-block" key={index}>
                {/* <span className="panel-icon">
            <i
                className="fas fa-book"
                aria-hidden="true"
            ></i>
        </span> */}
                {refinedInstruction}
            </p>
        );
    }

    return (
        <>
            <div className={'modal' + (props.isActive ? ' is-active' : '')}>
                <div className="modal-background" onClick={props.onClose}></div>
                <div className="modal-content">
                    <div className="box">
                        <nav className="panel">
                            <p className="panel-heading">Rutebeskrivelse</p>
                            {travelGuide}
                        </nav>
                    </div>
                </div>
                <button
                    className="modal-close is-large"
                    aria-label="close"
                    onClick={props.onClose}
                ></button>
            </div>
        </>
    );
};

export default Travelguide;
