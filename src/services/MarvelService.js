import { useHttp } from "../hooks/http.hook";

const useMarvelService = () => {
    const { loading, request, error, clearError } = useHttp();

    const _apiBase = 'https://gateway.marvel.com:443/v1/public/';
    const _apiKey = 'apikey=40e875820323d71cfb44b782b2566361';
    const _baseOffset = 300;

    const getAllCharacters = async (offset = _baseOffset) => {
        const res = await request(`${_apiBase}characters?limit=9&offset=${offset}&${_apiKey}`);
        return res.data.results.map(_transformCharacter)
    }

    const getCharacterByName = async (name) => {
        const res = await request(`${_apiBase}characters?name=${name}&${_apiKey}`);
        return res.data.results.map(_transformCharacter);

    }

    const getCharacter = async (id) => {
        const res = await request(`${_apiBase}characters/${id}?${_apiKey}`);
        return _transformCharacter(res.data.results[0])
    }

    const _transformCharacter = (char) => {
        return {
            id: char.id,
            name: char.name,
            description: char.description ? `${char.description.slice(0, 210)}...` : 'There is no description for this character',
            thumbnail: `${char.thumbnail.path}.${char.thumbnail.extension}`,
            homepage: char.urls[0].url, 
            wiki: char.urls[1].url,
            comics: char.comics.items
        }
    }

    const getAllComics = async (offset = _baseOffset) => {
        const res = await request(`${_apiBase}comics?limit=8&offset=${offset}&${_apiKey}`)
        return res.data.results.map(_transformComics)
    }

    const getComic = async (id) => {
        const res = await request(`${_apiBase}comics/${id}?${_apiKey}`);
        return _transformComics(res.data.results[0])
    }

    const _transformComics = (e) => {
        return {
            id: e.id,
            thumbnail: `${e.thumbnail.path}.${e.thumbnail.extension}`,
            name: e.title,
            price: e.prices[0].price
				? `${e.prices[0].price}$`
				: "not available",
            description: e.description || 'There is no description for this character',
            pageCount: e.pageCount
				? `${e.pageCount} p.`
				: "No information about the number of pages",
            language: e.textObjects[0]?.language || "en-us",

        }
    } 

    return {
		loading,
		error,
		clearError,
		getAllCharacters,
        getCharacterByName,
		getCharacter,
		getAllComics,
		getComic,
	};
}

export default useMarvelService;