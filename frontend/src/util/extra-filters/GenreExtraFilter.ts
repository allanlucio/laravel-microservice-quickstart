import * as yup from '../vendor/yup';
import { State } from '../../store/filter/types';
import {ExtraFilter} from "../../hooks/useFilter";


const GenreExtraFilterDefinition:ExtraFilter = {
    createValidationSchema(){
        return {
            genres: yup.mixed()
                .nullable()
                .transform(value => {
                    return !value || value === '' ? undefined : value.split(',')
                })
                .default(null)
        };
    },
    formatSearchParams(debouncedState){
        return debouncedState.extraFilter ? {
            ...(
                debouncedState.extraFilter.genres &&
                { genres: debouncedState.extraFilter.genres.join(',') }
            )
        } : undefined
    },
    getStateFromUrl(queryParams) {
        return {
            genres: queryParams.get('genres')
        }
    }
}

export default GenreExtraFilterDefinition;