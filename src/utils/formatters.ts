
export const formatCPF = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    return numbers
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d{1,2})/, '$1-$2')
        .replace(/(-\d{2})\d+?$/, '$1');
};

export const formatPhone = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    return numbers
        .replace(/(\d{2})(\d)/, '($1) $2')
        .replace(/(\d{5})(\d)/, '$1-$2')
        .replace(/(-\d{4})\d+?$/, '$1');
};

export const unformat = (value: string) => value.replace(/\D/g, '');
