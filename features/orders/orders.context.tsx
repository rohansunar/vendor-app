import React, { createContext, useContext, useState } from 'react';

type OrdersSelectionContextType = {
    selectedIds: string[];
    toggleSelect: (id: string) => void;
    clearSelection: () => void;
    isSelectionMode: boolean;
    setSelectionMode: (value: boolean) => void;
};

const OrdersSelectionContext =
    createContext<OrdersSelectionContextType | null>(null);

export function OrdersSelectionProvider({
    children,
}: {
    children: React.ReactNode;
}) {
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const [isSelectionMode, setSelectionMode] = useState(false);

    function toggleSelect(id: string) {
        setSelectedIds((prev) =>
            prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
        );
    }

    function clearSelection() {
        setSelectedIds([]);
        setSelectionMode(false);
    }

    return (
        <OrdersSelectionContext.Provider
            value={{
                selectedIds,
                toggleSelect,
                clearSelection,
                isSelectionMode,
                setSelectionMode,
            }}
        >
            {children}
        </OrdersSelectionContext.Provider>
    );
}

export function useOrdersSelection() {
    const context = useContext(OrdersSelectionContext);
    if (!context) {
        throw new Error('useOrdersSelection must be used inside provider');
    }
    return context;
}
