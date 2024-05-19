import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

import './comicsList.scss';
import useMarvelService from '../../services/MarvelService';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';

const ComicsList = () => {
    const {loading, error, getAllComics} = useMarvelService();
    const [comics, setComics] = useState([]);
    const [offset, setOffset] = useState(436);
    const [newItemLoading, setNewItemLoading] = useState(false);

    useEffect(() => {
        onRequest(offset, true);
    }, [])

    const onRequest = (offset, initial) => {
        initial ? setNewItemLoading(false) : setNewItemLoading(true);
        getAllComics(offset)
            .then(onComicsLoaded)
    }

    const onComicsLoaded = (newComics) => {
        setComics(comics => [...comics, ...newComics]);
        setOffset(offset + 8);
        setNewItemLoading(false);
    }

    function renderItems(arr) {
        const items = arr.map((item, index) => {
            return (
                <li key={index} className="comics__item">
                    <Link to={`/comics/${item.id}`}>
                        <img src={item.thumbnail} alt="ultimate war" className="comics__item-img"/>
                        <div className="comics__item-name">{item.name}</div>
                        <div className="comics__item-price">{item.price}</div>
                    </Link>
                </li>
            )
        })
        return (
            <ul className="comics__grid">
                {items}
            </ul>
        )
    }

    const errorMessage = error && !items ? <ErrorMessage/> : null;
    const spinner = loading && !newItemLoading ? <Spinner/> : null;
    const items = renderItems(comics);

    return (
        <div className="comics__list">
            {errorMessage}
            {spinner}
            {items}
            <button onClick={() => onRequest(offset)} disabled={newItemLoading} className="button button__main button__long">
                <div className="inner">load more</div>
            </button>
        </div>
    )
}

export default ComicsList;