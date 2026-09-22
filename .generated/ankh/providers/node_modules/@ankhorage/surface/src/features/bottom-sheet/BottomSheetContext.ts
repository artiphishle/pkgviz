import React from 'react';

import type { BottomSheetController } from '../../types/bottomSheet';

export const BottomSheetContext = React.createContext<BottomSheetController | null>(null);
