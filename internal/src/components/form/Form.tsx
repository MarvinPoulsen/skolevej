import React, { FC, useState } from 'react';
import Autocomplete from '../dawa/Autocomplete';
import './form.scss';

interface FormProps {
    data: any;
    onCalculate: (
        schoolId: number,
        toCoord: string,
        distance: string,
        endAddress: string
    ) => void;
}

const Form: FC = (props: FormProps) => {
    const [schoolId, setSchoolId] = useState<number>();
    const [school, setSchool] = useState<string>(null);
    const options = props.data;
    const [endPoint, setEndPoint] = useState<string>(null);
    const [endAddress, setEndAddress] = useState<string>(null);
    const [distance, setDistance] = useState<string>('2500');

    const onSelected = (coord, address) => {
        setEndPoint(coord);
        setEndAddress(address);
    };
    const handleSelectedOption = (event) => {
        const schoolId = parseInt(event.target.value);
        const school = props.data.find((item) => item.id === schoolId);
        setSchoolId(schoolId);
        setSchool(school.skole);
    };
    const handleChange = (event) => {
        setDistance(event.target.value);
    };
    const formHasValues = !school || !endPoint ? true : false;
    const handleClick = (event) => {
        event.preventDefault();
        props.onCalculate(schoolId, endPoint, distance, endAddress);
    };
const handleTest = (event)=> {
    event.preventDefault();
    console.log('schoolId:',schoolId)
    console.log('school:',school)
    console.log('endPoint:',endPoint)
    console.log('endAddress:',endAddress)
    console.log('distance:',distance)
    console.log('props.data:',props.data)

}
const handleClearInput = ()=> {
    setEndPoint(null);
    setEndAddress(null);
}

    return (
        <>
            <form>
                <div className="field">
                    {/* <div className="control is-expanded"> */}
                        <label className="label">Skole</label>
                        <div className="select">
                            <select
                                onChange={handleSelectedOption}
                                name="schoolId"
                                value={schoolId}
                            >
                                <option key="0" value="0" hidden></option>
                                {options.map((option) => (
                                    <option key={option.id} value={option.id}>
                                        {option.skole}
                                    </option>
                                ))}
                            </select>
                        </div>
                    {/* </div> */}
                </div>

                <Autocomplete 
                    onAdresSelected={onSelected}
                    maxSuggestions={5}
                    onClearInput={handleClearInput}
                />

                <div className="field">
                    <label className="label">Klassetrin</label>
                    <div className="control radio-list">
                        <label className="radio">
                            <input
                                type="radio"
                                name="question"
                                id="1"
                                value="2500"
                                checked={distance === '2500'}
                                onChange={handleChange}
                            />
                            Indskolingen (0.- 3. klasse)
                        </label>
                        <label className="radio">
                            <input
                                type="radio"
                                name="question"
                                id="2"
                                value="6000"
                                checked={distance === '6000'}
                                onChange={handleChange}
                            />
                            Mellemtrin (4.- 6. klasse)
                        </label>
                        <label className="radio">
                            <input
                                type="radio"
                                name="question"
                                id="3"
                                value="7000"
                                checked={distance === '7000'}
                                onChange={handleChange}
                            />
                            Overbygning (7.- 9. klasse)
                        </label>
                        <label className="radio">
                            <input
                                type="radio"
                                name="question"
                                id="4"
                                value="9000"
                                checked={distance === '9000'}
                                onChange={handleChange}
                            />
                            10. klasse
                        </label>
                    </div>
                </div>

                <div className="field is-grouped">
                    <div className="control">
                        <button
                            className="button is-link"
                            disabled={formHasValues}
                            onClick={handleClick}
                        >
                            Beregn
                        </button>
                    </div>
                    <div className="control">
                        <button 
                            className="button is-link"
                            onClick={handleTest}
                        >
                            Test indhold
                        </button>
                    </div>
                    <div className="control">
                        <button 
                            className="button is-link is-light"
                        >
                            Slet alt
                        </button>
                    </div>
                </div>
            </form>
        </>
    );
};

export default Form;
