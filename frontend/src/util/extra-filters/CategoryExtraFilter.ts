import * as yup from '../vendor/yup';
import { State } from '../../store/filter/types';
import {ExtraFilter} from "../../hooks/useFilter";


export const CategoryExtraFilterDefinition:ExtraFilter = {
    createValidationSchema(){
        return {
            categories: yup.mixed()
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
                debouncedState.extraFilter.categories &&
                { categories: debouncedState.extraFilter.categories.join(',') }
            )
        } : undefined
    },
    getStateFromUrl(queryParams) {
        return {
            categories: queryParams.get('categories')
        }
    }
}