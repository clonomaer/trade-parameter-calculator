import { config, PositionSubType } from 'configs'
import { localCache } from 'contexts/local-cache'
import _ from 'lodash'
import { ReplaySubject, Subject } from 'rxjs'
import { distinctUntilChanged, filter, map } from 'rxjs/operators'
import { getSubjectValue } from 'utils/get-subject-value'

export const Fields$ = localCache.observe<{
    [x in PositionSubType]: {
        [x: string]: string
    }
}>(
    'fields',
    config.PositionSubTypes.reduce(
        (acc, subType) => ({
            ...acc,
            [subType.id]: subType.fields.reduce(
                (acc, field) => ({
                    ...acc,
                    [field.id]: '',
                }),
                {},
            ),
        }),
        {},
    ),
)

export const FieldSubjects: {
    [x in PositionSubType]: { [x: string]: Subject<string> }
} = config.PositionSubTypes.reduce(
    (acc, subType) => ({
        ...acc,
        [subType.id]: subType.fields.reduce(
            (acc, field) => ({
                ...acc,
                [field.id]: new ReplaySubject(1),
            }),
            {},
        ),
    }),
    {} as any,
)

_.forEach(FieldSubjects, (subType, subTypeKey) => {
    _.forEach(subType, (subject, subjectKey) => {
        subject
            .pipe(
                distinctUntilChanged(),

                map(value => {
                    const res = getSubjectValue(Fields$) ?? {}
                    _.merge(res, { [subTypeKey]: { [subjectKey]: value } })
                    return res
                }),
            )
            .subscribe(Fields$)

        Fields$.pipe(
            distinctUntilChanged((prev, curr) =>
                _.isEqual(prev[subTypeKey], curr[subTypeKey]),
            ),
            map(x => x[subTypeKey]),
            filter(_.negate(_.isUndefined)),
            map(x => x[subjectKey]),
            distinctUntilChanged(),
            filter(_.negate(_.isUndefined)),
        ).subscribe(subject)
    })
})
