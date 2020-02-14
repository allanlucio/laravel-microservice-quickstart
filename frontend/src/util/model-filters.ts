import { Category, Genre } from "./models";

export function getGenresFromCategory(genres: Genre[], category: Category){
    return genres.filter(
        genre => genre.categories.filter(
            cat=> cat.id === category.id).length !== 0
    )
}
export function genresHasAtLeastOneCategory(genres:Genre[],categories: Category[]){

    return genres.filter(genre=>{
        return genre.categories.filter(category=>{
            const categoriesMatch = categories.findIndex((element)=> element.id===category.id);
            return categoriesMatch !== -1;
        }).length !== 0;
    });
    
}

