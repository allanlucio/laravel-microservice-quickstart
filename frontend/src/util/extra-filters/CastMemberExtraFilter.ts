import * as yup from '../vendor/yup';
import { State } from '../../store/filter/types';
import { ExtraFilter } from "../../hooks/useFilter";
import { CastMemberTypeMap } from '../models';

const castMemberNames = Object.values(CastMemberTypeMap);
export const CastMemberExtraFilter: ExtraFilter = {
    createValidationSchema() {
        return {
            type: yup.string()
                .nullable()
                .transform(value => {
                    return !value || !castMemberNames.includes(value) ? undefined : value;
                })
                .default(null)

        };
    },
    formatSearchParams(debouncedState) {
        return debouncedState.extraFilter ? {
            ...(
                debouncedState.extraFilter.type &&
                { type: debouncedState.extraFilter.type }
            )
        } : undefined
    },
    getStateFromUrl(queryParams) {
        return {
            type: queryParams.get('type')
        }
    }
}