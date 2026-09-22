import React from 'react';

import type { AccordionContextValue } from '../../../../types/accordion';

export const AccordionContext = React.createContext<AccordionContextValue | null>(null);
