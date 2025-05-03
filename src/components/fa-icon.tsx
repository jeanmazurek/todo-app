import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { IconSvgProps } from '@/types';

export interface FontAwesomeIconProps extends Omit<IconSvgProps, 'mask'> {
    icon: IconProp;
}

export const FAIcon: React.FC<FontAwesomeIconProps> = ({
    size = 24,
    width,
    height,
    color = "currentColor",
    icon,
    className,
    ...props
}) => {
    const calculatedWidth = width || size;
    const calculatedHeight = height || size;

    return (
        <FontAwesomeIcon
            icon={icon}
            width={calculatedWidth}
            height={calculatedHeight}
            color={color}
            className={className}
            {...props as any}
        />
    );
};