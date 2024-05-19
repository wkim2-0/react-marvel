import { useState, useEffect, useRef } from 'react';

import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage'
import useMarvelService from '../../services/MarvelService';

import './charList.scss';

const CharList = (props) =>  {

    const [char, setChar] = useState([]);
    const [newItemLoading, setNewItemLoading] = useState(false);
    const [offset, setOffset] = useState(436);
    const [charEnded, setCharEnded] = useState(false);

    const {loading, error, getAllCharacters} = useMarvelService();


    useEffect(() => {
        onRequuest(offset, true);
    }, [])

    const onRequuest = (offset, initial) => {
        initial ? setNewItemLoading(false) : setNewItemLoading(true);
        getAllCharacters(offset)
            .then(onCharLoaded)
    }

    const onCharLoaded = (newChar) => {
        let ended = false;
        if (newChar.lenght < 9) {
            ended = true;
        }

        setChar(char => [...char, ...newChar]);
        setOffset(offset => offset + 9);
        setNewItemLoading(false);
        setCharEnded(charEnded => ended);
        
    }

    const itemRef = useRef([]);


    const onCharSelected = (id, index) => {
        props.onCharSelected(id);
        itemRef.current.forEach(item => {
            item.classList.remove('char__item_selected');
        });
        itemRef.current[index].classList.add('char__item_selected');
    }


    // Этот метод создан для оптимизации, 
    // чтобы не помещать такую конструкцию в метод render
    function renderItems(arr) {
        const items = arr.map((item, index) => {
            let imgStyle = {'objectFit' : 'cover'};
            if (item.thumbnail === 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg') {
                imgStyle = {'objectFit' : 'unset'};
            }
            
            return (
                <li 
                    className="char__item"
                    key={item.id}
                    ref={el => itemRef.current[index] = el}
                    onClick={() => onCharSelected(item.id, index)}>
                        <img src={item.thumbnail} alt={item.name} style={imgStyle}/>
                        <div className="char__name">{item.name}</div>
                </li>
            )
        });
        // Для центровки спиннера/ошибки
        return (
            <ul className="char__grid">
                {items}
            </ul>
        )

    }

    const errorMessage = error ? <ErrorMessage/> : null;
    const spinner = loading && !newItemLoading ? <Spinner/> : null;
    const items = renderItems(char)

    return (
        <div className="char__list">
            {errorMessage}
            {spinner}
            {items}
            <button 
                className="button button__main button__long"
                disabled={newItemLoading}
                style={{'display': charEnded ? 'none' : 'block'}}
                onClick={() => onRequuest(offset)}
            >
                <div className="inner">load more</div>
            </button>
        </div>
    )
}

export default CharList;