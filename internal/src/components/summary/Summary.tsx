import React, { FC, useState } from 'react';
import Travelguide from '../modal/Travelguide';

const toPrettyNumber = (numValue) => {
    return new Intl.NumberFormat().format(numValue);
};
const calcDistance = (actually, requirements) => {
    const act10 = Math.round(actually / 10);
    const act100 = Math.round(actually / 100);
    const req10 = Math.round(requirements / 10);
    const req100 = Math.round(requirements / 100);
    if (act10 === req10) {
        return toPrettyNumber(actually / 1000);
    } else if (act100 === req100) {
        return toPrettyNumber(act10 / 100);
    } else {
        return toPrettyNumber(act100 / 10);
    }
};
interface SummaryProps {
    travelDistanceInMeter: number;
    instructions: string[];
    distance: number;
    endAddress: string;
    schoolName: string;
    schoolAddress: string;
    grade: string;
    district?: string;
}

const Summary: FC = (props: SummaryProps) => {
    console.log(props)
    const [isActive, setIsActive] = useState<boolean>(false);

    const entitled =
        props.district ?
            props.travelDistanceInMeter > props.distance
                ? 'message is-success'
                : 'message is-danger'
            :'message is-danger';
    const header =
        props.district ?
            props.travelDistanceInMeter > props.distance
                ? 'Berettiget til tilskud'
                : 'Ikke berettiget til tilskud'
            :'Udenfor skoledistriktet, ikke berettiget til tilskud';

    const handleClick = () => {
        setIsActive(true);
    };
    const onClose = () => {
        setIsActive(false);
    };
    const travelDistanceInMeter = calcDistance(
        props.travelDistanceInMeter,
        props.distance
    );
    return (
        <>
            <article className={entitled}>
                <div className="message-header">
                    <p>{header}</p>

                </div>
                <div className="message-body">
                    <div className="content">
                        <dl>
                            <dt>Fra adresse:</dt>
                            <dd>{props.schoolName}</dd>
                            <dd>{props.schoolAddress}</dd>
                            <dt>Til adresse:</dt>
                            <dd>{props.endAddress}</dd>
                            <dt>Afstand:</dt>
                            <dd>{travelDistanceInMeter} km</dd>
                        </dl>
                        <em>
                            På klassetrin ({props.grade}) udstedes der buskort
                            til alle elever, der har længere skolevej end{' '}
                            {toPrettyNumber(props.distance / 1000)} km
                        </em>
                    </div>
                    <button 
                        className="button" 
                        onClick={handleClick}
                    >
                        Rutebeskrivelse
                    </button>
                </div>
            </article>
            <Travelguide
                instructions={props.instructions}
                isActive={isActive}
                onClose={onClose}
            />
        </>
    );
};

export default Summary;
