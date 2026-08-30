import React, { useState } from 'react';
import { Address } from '../types';
import { HYDERABAD_LOCALITIES } from '../data/products';

interface AddressModalProps {
  isOpen: boolean;
  onClose: () => void;
  addresses: Address[];
  currentAddress: Address;
  onSelectAddress: (address: Address) => void;
  onAddNewAddress: (address: Address) => void;
  onDeleteAddress?: (addressId: string) => void;
  onSetDefaultAddress?: (addressId: string) => void;
}

export const AddressModal: React.FC<AddressModalProps> = ({
  isOpen,
  onClose,
  addresses,
  currentAddress,
  onSelectAddress,
  onAddNewAddress,
  onDeleteAddress,
  onSetDefaultAddress
}) => {
  const [searchArea, setSearchArea] = useState('');
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [newTitle, setNewTitle] = useState('Home');
  const [newRecipient, setNewRecipient] = useState('Sai Santosh');
  const [newPhone, setNewPhone] = useState('+91 98450 12345');
  const [newLocality, setNewLocality] = useState('Himayatnagar');
  const [newFullAddress, setNewFullAddress] = useState('');
  const [newPincode, setNewPincode] = useState('500029');
  const [newTag, setNewTag] = useState<'Home' | 'Work' | 'Other'>('Home');

  if (!isOpen) return null;

  const filteredLocalities = HYDERABAD_LOCALITIES.filter(loc =>
    loc.toLowerCase().includes(searchArea.toLowerCase().trim())
  );

  const handleUseCurrentLocation = () => {
    const gpsAddress: Address = {
      id: `addr-gps-${Date.now()}`,
      title: 'Current Location (GPS)',
      recipientName: 'Sai Santosh',
      phoneNumber: '+91 98450 12345',
      fullAddress: '12th Main Road, Himayatnagar',
      locality: 'Himayatnagar',
      city: 'Hyderabad',
      state: 'Telangana',
      pincode: '500029',
      tag: 'Home',
      isDefault: false
    };
    onSelectAddress(gpsAddress);
    onClose();
  };

  const handleSelectLocality = (locality: string) => {
    const locAddress: Address = {
      id: `addr-loc-${Date.now()}`,
      title: locality,
      recipientName: 'Sai Santosh',
      phoneNumber: '+91 98450 12345',
      fullAddress: `Main Road, ${locality}`,
      locality: locality,
      city: 'Hyderabad',
      state: 'Telangana',
      pincode: '500001',
      tag: 'Other',
      isDefault: false
    };
    onSelectAddress(locAddress);
    onClose();
  };

  const handleSaveNewAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFullAddress.trim()) return;

    const newAddr: Address = {
      id: `addr-${Date.now()}`,
      title: newTitle || newLocality,
      recipientName: newRecipient,
      phoneNumber: newPhone,
      fullAddress: newFullAddress,
      locality: newLocality,
      city: 'Hyderabad',
      state: 'Telangana',
      pincode: newPincode || '500029',
      tag: newTag,
      isDefault: false
    };

    onAddNewAddress(newAddr);
    onSelectAddress(newAddr);
    setIsAddingNew(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
      <div
        className="bg-white w-full sm:max-w-md max-h-[85vh] rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 border-b border-[#e6ecf5] flex items-center justify-between sticky top-0 bg-white z-10">
          <div>
            <h2 className="text-[17px] font-extrabold text-[#141b2b]">
              Select Delivery Location
            </h2>
            <p className="text-[11px] text-[#5b6b62]">
              Superfast 15-20 mins delivery across Hyderabad
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#f1f3ff] hover:bg-[#e4ebfc] text-[#141b2b] flex items-center justify-center cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="overflow-y-auto p-4 flex flex-col gap-4 no-scrollbar">
          {/* GPS Button */}
          <button
            type="button"
            onClick={handleUseCurrentLocation}
            className="p-3.5 rounded-2xl bg-[#f1f8f4] hover:bg-[#caead6]/60 border border-[#006c49]/30 flex items-center justify-between text-left transition-all cursor-pointer group"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#006c49] text-white flex items-center justify-center shadow-xs">
                <span className="material-symbols-outlined text-[20px]">my_location</span>
              </div>
              <div>
                <h4 className="text-[13px] font-extrabold text-[#00422b]">
                  Use Current Location
                </h4>
                <p className="text-[11px] text-[#3c4a42]">
                  Himayatnagar, Hyderabad (Auto-detected via GPS)
                </p>
              </div>
            </div>
            <span className="material-symbols-outlined text-[18px] text-[#006c49] group-hover:translate-x-1 transition-transform">
              chevron_right
            </span>
          </button>

          {/* Search Hyderabad Area */}
          <div className="flex flex-col gap-2">
            <label className="text-[11px] font-extrabold text-[#5b6b62] uppercase tracking-wider">
              Search Hyderabad Locality
            </label>
            <div className="relative flex items-center">
              <span className="material-symbols-outlined absolute left-3 text-[#5b6b62] text-[18px]">
                search
              </span>
              <input
                type="text"
                value={searchArea}
                onChange={(e) => setSearchArea(e.target.value)}
                placeholder="e.g. Himayatnagar, Banjara Hills, Madhapur..."
                className="w-full pl-9 pr-3 py-2.5 rounded-2xl bg-[#f8fafc] border border-[#e6ecf5] text-[13px] font-medium outline-none focus:border-[#006c49] focus:bg-white"
              />
              {searchArea && (
                <button
                  type="button"
                  onClick={() => setSearchArea('')}
                  className="absolute right-3 text-[#5b6b62] hover:text-[#141b2b]"
                >
                  <span className="material-symbols-outlined text-[16px]">close</span>
                </button>
              )}
            </div>

            {/* Quick Hyderabad Area Chips */}
            {searchArea.trim() ? (
              <div className="max-h-36 overflow-y-auto flex flex-col gap-1 pt-1">
                {filteredLocalities.map((loc) => (
                  <button
                    key={loc}
                    onClick={() => handleSelectLocality(loc)}
                    className="p-2 text-left text-[12px] font-bold text-[#141b2b] hover:bg-[#f1f8f4] hover:text-[#006c49] rounded-xl transition-colors flex items-center justify-between"
                  >
                    <span>📍 {loc}, Hyderabad</span>
                    <span className="text-[10px] text-[#006c49] font-bold">Deliver here</span>
                  </button>
                ))}
              </div>
            ) : (
              <div className="flex flex-wrap gap-1.5 pt-1">
                {HYDERABAD_LOCALITIES.slice(0, 6).map((loc) => (
                  <button
                    key={loc}
                    onClick={() => handleSelectLocality(loc)}
                    className="px-2.5 py-1 rounded-full bg-[#f1f3ff] hover:bg-[#caead6] text-[11px] font-bold text-[#141b2b] transition-colors"
                  >
                    {loc}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Saved Addresses Section */}
          <div className="flex flex-col gap-2 pt-2 border-t border-[#e6ecf5]">
            <div className="flex items-center justify-between">
              <span className="text-[12px] font-extrabold text-[#141b2b] uppercase tracking-wider">
                Saved Addresses
              </span>
              <button
                type="button"
                onClick={() => setIsAddingNew(!isAddingNew)}
                className="text-[12px] font-bold text-[#006c49] hover:underline cursor-pointer flex items-center gap-0.5"
              >
                <span className="material-symbols-outlined text-[16px]">add</span>
                <span>Add New Address</span>
              </button>
            </div>

            {/* Add New Address Form Modal Accordion */}
            {isAddingNew && (
              <form onSubmit={handleSaveNewAddress} className="p-3.5 rounded-2xl bg-[#f8fafc] border border-[#006c49]/30 flex flex-col gap-3">
                <h4 className="text-[13px] font-extrabold text-[#141b2b]">New Hyderabad Address</h4>
                <div className="grid grid-cols-3 gap-1.5">
                  {(['Home', 'Work', 'Other'] as const).map(t => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setNewTag(t)}
                      className={`py-1.5 rounded-xl text-[11px] font-bold border transition-all ${
                        newTag === t ? 'bg-[#006c49] text-white border-[#006c49]' : 'bg-white text-[#5b6b62] border-[#e6ecf5]'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>

                <input
                  type="text"
                  placeholder="Address Title (e.g. Home, Office, Studio)"
                  value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                  className="px-3 py-2 rounded-xl bg-white border border-[#e6ecf5] text-[12px] font-medium outline-none focus:border-[#006c49]"
                />

                <input
                  type="text"
                  required
                  placeholder="House/Flat No., Street, Landmark"
                  value={newFullAddress}
                  onChange={e => setNewFullAddress(e.target.value)}
                  className="px-3 py-2 rounded-xl bg-white border border-[#e6ecf5] text-[12px] font-medium outline-none focus:border-[#006c49]"
                />

                <div className="grid grid-cols-2 gap-2">
                  <select
                    value={newLocality}
                    onChange={e => setNewLocality(e.target.value)}
                    className="px-3 py-2 rounded-xl bg-white border border-[#e6ecf5] text-[12px] font-medium outline-none focus:border-[#006c49]"
                  >
                    {HYDERABAD_LOCALITIES.map(loc => (
                      <option key={loc} value={loc}>{loc}</option>
                    ))}
                  </select>

                  <input
                    type="text"
                    placeholder="Pincode (e.g. 500029)"
                    value={newPincode}
                    onChange={e => setNewPincode(e.target.value)}
                    className="px-3 py-2 rounded-xl bg-white border border-[#e6ecf5] text-[12px] font-medium outline-none focus:border-[#006c49]"
                  />
                </div>

                <div className="flex gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setIsAddingNew(false)}
                    className="flex-1 py-2 rounded-xl text-[12px] font-bold bg-white border border-[#e6ecf5] text-[#5b6b62]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2 rounded-xl text-[12px] font-bold bg-[#006c49] text-white hover:bg-[#005236]"
                  >
                    Save Address
                  </button>
                </div>
              </form>
            )}

            {/* Address Cards */}
            <div className="flex flex-col gap-2">
              {addresses.map((addr) => {
                const isSelected = currentAddress.id === addr.id;
                return (
                  <div
                    key={addr.id}
                    className={`p-3.5 rounded-2xl border transition-all flex flex-col gap-1.5 ${
                      isSelected
                        ? 'bg-[#f1f8f4] border-[#006c49] ring-1 ring-[#006c49]'
                        : 'bg-white border-[#e6ecf5] hover:border-[#006c49]/40'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div
                        onClick={() => {
                          onSelectAddress(addr);
                          onClose();
                        }}
                        className="flex-1 cursor-pointer"
                      >
                        <div className="flex items-center gap-1.5">
                          <span className="material-symbols-outlined text-[16px] text-[#006c49]">
                            {addr.tag === 'Home' ? 'home' : addr.tag === 'Work' ? 'business' : 'location_on'}
                          </span>
                          <span className="text-[13px] font-extrabold text-[#141b2b]">
                            {addr.title}
                          </span>
                          {addr.isDefault && (
                            <span className="text-[10px] font-bold bg-[#caead6] text-[#00422b] px-1.5 py-0.2 rounded">
                              DEFAULT
                            </span>
                          )}
                        </div>
                        <p className="text-[12px] text-[#3c4a42] mt-0.5 leading-snug">
                          {addr.fullAddress}, {addr.locality}, Hyderabad, Telangana - {addr.pincode}
                        </p>
                        <p className="text-[11px] text-[#5b6b62]">
                          Contact: {addr.recipientName} ({addr.phoneNumber})
                        </p>
                      </div>

                      {/* Select indicator */}
                      <button
                        type="button"
                        onClick={() => {
                          onSelectAddress(addr);
                          onClose();
                        }}
                        className={`px-2.5 py-1 rounded-xl text-[11px] font-bold transition-colors cursor-pointer ${
                          isSelected
                            ? 'bg-[#006c49] text-white'
                            : 'bg-[#f1f3ff] text-[#006c49] hover:bg-[#caead6]'
                        }`}
                      >
                        {isSelected ? 'Deliver Here ✓' : 'Select'}
                      </button>
                    </div>

                    {/* Actions: Set Default, Delete */}
                    <div className="flex items-center justify-end gap-3 pt-1 border-t border-[#e6ecf5]/60 text-[11px]">
                      {onSetDefaultAddress && !addr.isDefault && (
                        <button
                          type="button"
                          onClick={() => onSetDefaultAddress(addr.id)}
                          className="text-[#006c49] font-bold hover:underline"
                        >
                          Set as Default
                        </button>
                      )}
                      {onDeleteAddress && addresses.length > 1 && (
                        <button
                          type="button"
                          onClick={() => onDeleteAddress(addr.id)}
                          className="text-[#ba1a1a] font-bold hover:underline"
                        >
                          Delete
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
