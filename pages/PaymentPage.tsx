import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { supabase } from '../src/lib/supabase';

interface PaymentState {
    clientId: string;
    clientName: string;
    clientEmail: string;
    clientCpf: string;
    clientPhone: string;
    asaasCustomerId: string;
    petId?: string;
    productType: 'subscription' | 'one_time';
    productName: string;
    productValue: number;
    billingCycle?: 'MONTHLY' | 'YEARLY';
    couponId?: string;
    discountAmount?: number;
}

const PaymentPage: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const paymentData = location.state as PaymentState | null;

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState<'credit_card' | 'pix'>('credit_card');

    // PIX data
    const [pixData, setPixData] = useState<{ qrCode: string; copyPaste: string; expirationDate: string } | null>(null);
    const [pixCopied, setPixCopied] = useState(false);

    // Credit card form
    const [cardData, setCardData] = useState({
        holderName: '',
        number: '',
        expiryMonth: '',
        expiryYear: '',
        ccv: '',
    });

    useEffect(() => {
        if (!paymentData) {
            navigate('/montar-box');
        }
    }, [paymentData, navigate]);

    if (!paymentData) {
        return null;
    }

    const isSubscription = paymentData.productType === 'subscription';
    const finalValue = paymentData.productValue - (paymentData.discountAmount || 0);

    const formatCardNumber = (value: string) => {
        const numbers = value.replace(/\D/g, '');
        return numbers.replace(/(\d{4})(?=\d)/g, '$1 ').substring(0, 19);
    };

    const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setCardData({ ...cardData, number: formatCardNumber(e.target.value) });
    };

    const handleGeneratePix = async () => {
        setLoading(true);
        setError(null);

        try {
            const { data, error: fnError } = await supabase.functions.invoke('create-one-time-payment', {
                body: {
                    clientId: paymentData.clientId,
                    petId: paymentData.petId,
                    asaasCustomerId: paymentData.asaasCustomerId,
                    value: finalValue,
                    description: paymentData.productName,
                    billingType: 'PIX',
                    customerName: paymentData.clientName,
                    customerEmail: paymentData.clientEmail,
                }
            });

            if (fnError) throw fnError;
            if (data?.error) throw new Error(data.error);

            if (data?.pixQrCode) {
                setPixData({
                    qrCode: data.pixQrCode,
                    copyPaste: data.pixCopyPaste,
                    expirationDate: data.pixExpirationDate,
                });
            }
        } catch (err: any) {
            setError(err.message || 'Erro ao gerar PIX');
        } finally {
            setLoading(false);
        }
    };

    const handleCopyPix = () => {
        if (pixData?.copyPaste) {
            navigator.clipboard.writeText(pixData.copyPaste);
            setPixCopied(true);
            setTimeout(() => setPixCopied(false), 3000);
        }
    };

    const handlePayWithCard = async () => {
        // Validate card data
        if (!cardData.holderName || !cardData.number || !cardData.expiryMonth || !cardData.expiryYear || !cardData.ccv) {
            setError('Preencha todos os dados do cartão');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const creditCard = {
                holderName: cardData.holderName,
                number: cardData.number.replace(/\s/g, ''),
                expiryMonth: cardData.expiryMonth,
                expiryYear: cardData.expiryYear,
                ccv: cardData.ccv,
            };

            const creditCardHolderInfo = {
                name: paymentData.clientName,
                email: paymentData.clientEmail,
                cpfCnpj: paymentData.clientCpf?.replace(/\D/g, ''),
                phone: paymentData.clientPhone?.replace(/\D/g, ''),
                postalCode: '70000000', // TODO: get from address
            };

            let result;

            if (isSubscription) {
                const { data, error: fnError } = await supabase.functions.invoke('create-subscription', {
                    body: {
                        clientId: paymentData.clientId,
                        petId: paymentData.petId,
                        asaasCustomerId: paymentData.asaasCustomerId,
                        value: finalValue,
                        cycle: paymentData.billingCycle || 'MONTHLY',
                        description: paymentData.productName,
                        creditCard,
                        creditCardHolderInfo,
                        customerName: paymentData.clientName,
                        customerEmail: paymentData.clientEmail,
                    }
                });
                result = { data, error: fnError };
            } else {
                const { data, error: fnError } = await supabase.functions.invoke('create-one-time-payment', {
                    body: {
                        clientId: paymentData.clientId,
                        petId: paymentData.petId,
                        asaasCustomerId: paymentData.asaasCustomerId,
                        value: finalValue,
                        description: paymentData.productName,
                        creditCard,
                        creditCardHolderInfo,
                        customerName: paymentData.clientName,
                        customerEmail: paymentData.clientEmail,
                    }
                });
                result = { data, error: fnError };
            }

            if (result.error) throw result.error;
            if (result.data?.error) throw new Error(result.data.error);

            setSuccess(true);
        } catch (err: any) {
            setError(err.message || 'Erro ao processar pagamento');
        } finally {
            setLoading(false);
        }
    };

    // Success screen
    if (success) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-primary/10 to-background-light dark:to-background-dark flex items-center justify-center p-4">
                <div className="max-w-md w-full bg-white dark:bg-surface-dark rounded-3xl p-8 text-center shadow-xl">
                    <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                        <span className="material-symbols-outlined text-4xl text-green-600">check_circle</span>
                    </div>
                    <h1 className="text-2xl font-bold text-text-main dark:text-white mb-2">
                        Pagamento Confirmado! 🎉
                    </h1>
                    <p className="text-text-secondary dark:text-text-dark-secondary mb-6">
                        {isSubscription
                            ? 'Sua assinatura foi ativada com sucesso! Em breve você receberá sua primeira PetBox.'
                            : 'Seu pedido foi confirmado! Em breve você receberá sua PetBox.'
                        }
                    </p>
                    <p className="text-sm text-text-secondary mb-8">
                        Um email de confirmação foi enviado para <strong>{paymentData.clientEmail}</strong>
                    </p>
                    <Link
                        to="/"
                        className="block w-full py-4 bg-primary text-white font-bold rounded-xl shadow-lg"
                    >
                        Voltar ao Início
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-primary/10 to-background-light dark:to-background-dark pb-8">
            {/* Header */}
            <header className="bg-white dark:bg-surface-dark shadow-sm">
                <div className="max-w-lg mx-auto px-4 py-4 flex items-center gap-4">
                    <button onClick={() => navigate(-1)} className="p-2 rounded-full hover:bg-black/5">
                        <span className="material-symbols-outlined">arrow_back</span>
                    </button>
                    <div>
                        <h1 className="text-xl font-bold text-text-main dark:text-white">Pagamento</h1>
                        <p className="text-sm text-text-secondary">Finalize sua compra</p>
                    </div>
                </div>
            </header>

            <main className="max-w-lg mx-auto px-4 py-6 space-y-6">
                {/* Order Summary */}
                <section className="bg-white dark:bg-surface-dark rounded-2xl p-6 shadow-sm">
                    <h2 className="font-bold text-text-main dark:text-white mb-4 flex items-center gap-2">
                        <span className="material-symbols-outlined text-primary">shopping_bag</span>
                        Resumo do Pedido
                    </h2>
                    <div className="space-y-3">
                        <div className="flex justify-between">
                            <span className="text-text-secondary">{paymentData.productName}</span>
                            <span className="font-bold text-text-main dark:text-white">
                                R$ {paymentData.productValue.toFixed(2).replace('.', ',')}
                            </span>
                        </div>
                        {paymentData.discountAmount && paymentData.discountAmount > 0 && (
                            <div className="flex justify-between text-green-600">
                                <span>Desconto</span>
                                <span>- R$ {paymentData.discountAmount.toFixed(2).replace('.', ',')}</span>
                            </div>
                        )}
                        <div className="border-t border-border-light dark:border-white/10 pt-3 flex justify-between">
                            <span className="font-bold text-text-main dark:text-white">Total</span>
                            <span className="font-bold text-xl text-primary">
                                R$ {finalValue.toFixed(2).replace('.', ',')}
                            </span>
                        </div>
                    </div>
                </section>

                {/* Payment Method Selection (only for one-time) */}
                {!isSubscription && (
                    <section className="bg-white dark:bg-surface-dark rounded-2xl p-6 shadow-sm">
                        <h2 className="font-bold text-text-main dark:text-white mb-4">
                            Forma de Pagamento
                        </h2>
                        <div className="grid grid-cols-2 gap-3">
                            <button
                                onClick={() => setPaymentMethod('credit_card')}
                                className={`p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-2 ${paymentMethod === 'credit_card'
                                        ? 'border-primary bg-primary/10'
                                        : 'border-border-light dark:border-white/10'
                                    }`}
                            >
                                <span className="material-symbols-outlined text-2xl">credit_card</span>
                                <span className="font-bold text-sm">Cartão</span>
                            </button>
                            <button
                                onClick={() => setPaymentMethod('pix')}
                                className={`p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-2 ${paymentMethod === 'pix'
                                        ? 'border-primary bg-primary/10'
                                        : 'border-border-light dark:border-white/10'
                                    }`}
                            >
                                <span className="material-symbols-outlined text-2xl">qr_code_2</span>
                                <span className="font-bold text-sm">PIX</span>
                            </button>
                        </div>
                    </section>
                )}

                {/* Credit Card Form */}
                {(isSubscription || paymentMethod === 'credit_card') && !pixData && (
                    <section className="bg-white dark:bg-surface-dark rounded-2xl p-6 shadow-sm">
                        <h2 className="font-bold text-text-main dark:text-white mb-4 flex items-center gap-2">
                            <span className="material-symbols-outlined text-blue-600">credit_card</span>
                            Dados do Cartão
                        </h2>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-text-secondary uppercase mb-1">
                                    Nome no Cartão
                                </label>
                                <input
                                    type="text"
                                    value={cardData.holderName}
                                    onChange={(e) => setCardData({ ...cardData, holderName: e.target.value.toUpperCase() })}
                                    placeholder="NOME COMO ESTÁ NO CARTÃO"
                                    className="w-full h-12 px-4 rounded-xl bg-background-light dark:bg-black/20 border border-border-light dark:border-white/10 focus:border-primary focus:outline-none text-text-main dark:text-white uppercase"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-text-secondary uppercase mb-1">
                                    Número do Cartão
                                </label>
                                <input
                                    type="text"
                                    value={cardData.number}
                                    onChange={handleCardNumberChange}
                                    placeholder="0000 0000 0000 0000"
                                    maxLength={19}
                                    className="w-full h-12 px-4 rounded-xl bg-background-light dark:bg-black/20 border border-border-light dark:border-white/10 focus:border-primary focus:outline-none text-text-main dark:text-white"
                                />
                            </div>
                            <div className="grid grid-cols-3 gap-3">
                                <div>
                                    <label className="block text-xs font-bold text-text-secondary uppercase mb-1">Mês</label>
                                    <select
                                        value={cardData.expiryMonth}
                                        onChange={(e) => setCardData({ ...cardData, expiryMonth: e.target.value })}
                                        className="w-full h-12 px-3 rounded-xl bg-background-light dark:bg-black/20 border border-border-light dark:border-white/10 focus:border-primary focus:outline-none text-text-main dark:text-white"
                                    >
                                        <option value="">MM</option>
                                        {Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, '0')).map(m => (
                                            <option key={m} value={m}>{m}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-text-secondary uppercase mb-1">Ano</label>
                                    <select
                                        value={cardData.expiryYear}
                                        onChange={(e) => setCardData({ ...cardData, expiryYear: e.target.value })}
                                        className="w-full h-12 px-3 rounded-xl bg-background-light dark:bg-black/20 border border-border-light dark:border-white/10 focus:border-primary focus:outline-none text-text-main dark:text-white"
                                    >
                                        <option value="">AAAA</option>
                                        {Array.from({ length: 10 }, (_, i) => String(new Date().getFullYear() + i)).map(y => (
                                            <option key={y} value={y}>{y}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-text-secondary uppercase mb-1">CVV</label>
                                    <input
                                        type="text"
                                        value={cardData.ccv}
                                        onChange={(e) => setCardData({ ...cardData, ccv: e.target.value.replace(/\D/g, '').substring(0, 4) })}
                                        placeholder="123"
                                        maxLength={4}
                                        className="w-full h-12 px-4 rounded-xl bg-background-light dark:bg-black/20 border border-border-light dark:border-white/10 focus:border-primary focus:outline-none text-text-main dark:text-white text-center"
                                    />
                                </div>
                            </div>
                        </div>
                    </section>
                )}

                {/* PIX Section */}
                {!isSubscription && paymentMethod === 'pix' && (
                    <section className="bg-white dark:bg-surface-dark rounded-2xl p-6 shadow-sm">
                        <h2 className="font-bold text-text-main dark:text-white mb-4 flex items-center gap-2">
                            <span className="material-symbols-outlined text-green-600">qr_code_2</span>
                            Pagamento via PIX
                        </h2>

                        {!pixData ? (
                            <div className="text-center py-6">
                                <p className="text-text-secondary mb-4">
                                    Clique no botão abaixo para gerar o QR Code PIX
                                </p>
                                <button
                                    onClick={handleGeneratePix}
                                    disabled={loading}
                                    className="px-6 py-3 bg-green-600 text-white font-bold rounded-xl flex items-center gap-2 mx-auto disabled:opacity-50"
                                >
                                    {loading ? (
                                        <span className="material-symbols-outlined animate-spin">progress_activity</span>
                                    ) : (
                                        <span className="material-symbols-outlined">qr_code</span>
                                    )}
                                    Gerar QR Code PIX
                                </button>
                            </div>
                        ) : (
                            <div className="text-center space-y-4">
                                <div className="bg-white p-4 rounded-xl inline-block">
                                    <img
                                        src={`data:image/png;base64,${pixData.qrCode}`}
                                        alt="QR Code PIX"
                                        className="w-48 h-48"
                                    />
                                </div>
                                <p className="text-sm text-text-secondary">
                                    Escaneie o QR Code com o app do seu banco
                                </p>
                                <button
                                    onClick={handleCopyPix}
                                    className="w-full py-3 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 font-bold rounded-xl flex items-center justify-center gap-2"
                                >
                                    <span className="material-symbols-outlined">
                                        {pixCopied ? 'check' : 'content_copy'}
                                    </span>
                                    {pixCopied ? 'Copiado!' : 'Copiar código PIX'}
                                </button>
                                <p className="text-xs text-text-secondary">
                                    Válido até {new Date(pixData.expirationDate).toLocaleString('pt-BR')}
                                </p>
                            </div>
                        )}
                    </section>
                )}

                {/* Error Message */}
                {error && (
                    <div className="p-4 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-xl flex items-center gap-2">
                        <span className="material-symbols-outlined">error</span>
                        {error}
                    </div>
                )}

                {/* Pay Button (for card) */}
                {(isSubscription || paymentMethod === 'credit_card') && !pixData && (
                    <button
                        onClick={handlePayWithCard}
                        disabled={loading}
                        className="w-full py-4 bg-primary text-white font-bold rounded-xl shadow-lg shadow-primary/20 flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                        {loading ? (
                            <>
                                <span className="material-symbols-outlined animate-spin">progress_activity</span>
                                Processando...
                            </>
                        ) : (
                            <>
                                <span className="material-symbols-outlined">lock</span>
                                Pagar R$ {finalValue.toFixed(2).replace('.', ',')}
                            </>
                        )}
                    </button>
                )}

                {/* Security Badge */}
                <div className="text-center text-xs text-text-secondary flex items-center justify-center gap-2">
                    <span className="material-symbols-outlined text-green-600 text-lg">verified_user</span>
                    Pagamento seguro processado por Asaas
                </div>
            </main>
        </div>
    );
};

export default PaymentPage;
