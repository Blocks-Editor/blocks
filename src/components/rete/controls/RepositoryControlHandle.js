import React from 'react';
import classNames from 'classnames';
import useControlValue from '../../../hooks/useControlValue';
import parseGithubPackage from '../../../utils/parseGithubPackage';

const fields = [/*['name', 'Name'], */['repo', 'Repo'], ['version', 'Branch'], ['dir', 'Directory'], ['homepage', 'Homepage']];

export default function RepositoryControlHandle({control, bindInput}) {
    const [value, setValue] = useControlValue(control);

    const invalid = !control.validate(value);

    const result = parseGithubPackage(value/*, control.getData('name')*/);

    return (
        <div ref={bindInput}>
            <input
                type="text"
                className={classNames('w-100', invalid && 'invalid')}
                autoComplete="blocks-app"
                autoCorrect="off"
                ref={bindInput}
                value={value || ''}
                placeholder={control.name}
                minLength={1}
                onChange={event => setValue(event.target.value || undefined)}
            />
            {!!result && (
                <div className="mt-2">
                    {fields.map(([key, label]) =>
                        !!result[key] && (
                            <div key={key} className="d-flex mb-1">
                                <small className="flex-grow-1 opacity-50">
                                    {label}
                                </small>
                                <small className="text-success fw-bold">
                                    {result[key]}
                                </small>
                            </div>
                        ))}
                    {/*<hr/>*/}
                    {/*<span></span>*/}
                </div>
            )}
        </div>
    );
}
