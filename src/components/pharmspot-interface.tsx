import React, { useState, useMemo } from 'react';
import { Search, Plus, X, Pill, FileText, FolderPlus, Download, Edit3 } from 'lucide-react';

const FarmaciInterface = () => {
  const [selectedFarmaci, setSelectedFarmaci] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Tutti');
  const [customCategories, setCustomCategories] = useState({});

  const farmaciData = {
    'Antiaritmici': ['Verapamil', 'Sotalol', 'Reproterol', 'Propatenon', 'Pindolol', 'Metoprolol', 'Flecainid', 'Esmolol', 'Amiodarone', 'Adenosine'],
    'Anticolinergici': ['Atropine'],
    'Antiemetici': ['TROPIsetron', 'Ondansetron', 'Metociopramide', 'Droperidol'],
    'Broncodilatatori': ['Theophyllin', 'Salbutamol', 'Orciprenalin', 'Ipratropiumbromid'],
    'Elettroliti': ['Na-Iniosumat', 'NaCl%', 'MAGNESIUMsulfat', 'MAGNESIUMaspartat', 'KCl mmol/ml', 'Glycer...', 'Calciomf'],
    'Ormoni': ['Prednisolon', 'Oxytocin', 'Methylprednisolon', 'Insulin', 'Hydrocortison', 'Dexamethasone'],
    'Ipnotici Antagonisti': ['Flumazenil'],
    'Ipnotici Tranquillanti': ['Lorazepam', 'LovomoDropmazino', 'Phenobarbital', 'Midazolam', 'Diazepam', 'Daxmodoromicino', 'Clonazepam'],
    'Induzione': ['Midazolam', 'Propofor', 'Thiopentone', 'Propofol', 'Levetiracetam', 'Ketamine', 'Etomidate'],
    'Linee': ['Linea Periferica', 'Linea Epidurale', 'Linea Venosa Centrale', 'Linea Arteriosa'],
    'Anestetici Locali': ['PRILOcaine %', 'ROPIvacaine %', 'MEPIvacaine %', 'LIGNOcaine %', 'LIDOcaine %', 'LEVUDupivacamo', 'BUPIvacaine %'],
    'Miorilassanti': ['PANCUronium', 'suxamethonium', 'VECUronium', 'ROCUronium', 'MIVACUriUm', 'Curare', 'CISAtracurium', 'ATRACUriUM'],
    'Narcoantagonisti': ['Naloxone'],
    'Oppiacei': ['Tramadol', 'SUFentanil', 'REMItentanil', 'Pethidine', 'Oxycodone', 'Morphine', 'Methadone', 'FENTanyl', 'ALFentanil'],
    'Anticolinesterasici': ['Sugammadex', 'Neostigmine'],
    'Simpaticolitici': ['Urapidil', 'NITROglycerine', 'NIMOdipine', 'NICArdiipine', 'METOprolol', 'LABEtalol', 'Isosorbidedinitrate', 'ESMOlol', 'CLOnidine', 'ATEnolol'],
    'Simpaticomimetici': ['NORAdrenaline', 'ADREnaine', 'PHENylephrine', 'Metaraminol', 'ISOprenaline', 'ETILephrine', 'EPHEdrine', 'DOPAmine', 'DOBUtamine'],
    'Altre': ['Prysiologicar', 'LASA ALERT', 'HIGH ALERT MEDICATION', 'POtassium Chloride', 'Salbutamol', 'Trimethobina', 'Quinapril', 'Oxytocin', 'metilprednisolona', 'Tron Sucrose', 'Insulin', 'Dexamethasone', 'Danaparoide', 'Bronco-dilator', 'MILK TYPE D', 'MILK TYPE C', 'MILK TYPE B', 'MILK TYPE A']
  };

  const allFarmaciData = useMemo(() => ({
    ...farmaciData,
    ...customCategories
  }), [customCategories]);

  const categories = useMemo(() => [
    'Tutti', 
    ...Object.keys(farmaciData), 
    ...Object.keys(customCategories)
  ], [customCategories]);

  const filteredFarmaci = useMemo(() => {
    let allFarmaci = [];
    
    if (selectedCategory === 'Tutti') {
      Object.entries(allFarmaciData).forEach(([category, farmaci]) => {
        if (Array.isArray(farmaci)) {
          farmaci.forEach(farmaco => {
            allFarmaci.push({ name: farmaco, category });
          });
        }
      });
    } else {
      const categoryFarmaci = allFarmaciData[selectedCategory];
      if (Array.isArray(categoryFarmaci)) {
        categoryFarmaci.forEach(farmaco => {
          allFarmaci.push({ name: farmaco, category: selectedCategory });
        });
      }
    }

    if (searchTerm) {
      allFarmaci = allFarmaci.filter(farmaco =>
        farmaco.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return allFarmaci;
  }, [selectedCategory, searchTerm, allFarmaciData]);

  const addFarmaco = (farmaco) => {
    if (!selectedFarmaci.some(f => f.name === farmaco.name)) {
      setSelectedFarmaci(prev => [...prev, { ...farmaco, id: Date.now() + Math.random() }]);
    }
  };

  const removeFarmaco = (id) => {
    setSelectedFarmaci(prev => prev.filter(f => f.id !== id));
  };

  const generatePDF = () => {
    if (selectedFarmaci.length === 0) {
      alert('Nessun farmaco selezionato per la stampa.');
      return;
    }

    try {
      const currentDate = new Date().toLocaleDateString('it-IT');
      const currentTime = new Date().toLocaleTimeString('it-IT');
      
      // Raggruppa i farmaci per categoria
      const farmaciByCategory = {};
      selectedFarmaci.forEach(farmaco => {
        if (!farmaciByCategory[farmaco.category]) {
          farmaciByCategory[farmaco.category] = [];
        }
        farmaciByCategory[farmaco.category].push(farmaco);
      });

      // Genera contenuto HTML semplificato
      let htmlContent = `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Lista Farmaci - PharmSpot</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; color: #333; }
        .header { text-align: center; margin-bottom: 30px; }
        .title { color: #10b981; font-size: 24px; margin-bottom: 10px; }
        .info { color: #666; margin-bottom: 20px; }
        .category { margin: 20px 0; }
        .category-title { background: #10b981; color: white; padding: 10px; font-weight: bold; }
        .farmaco { padding: 5px 10px; border-bottom: 1px solid #eee; }
        .print-btn { background: #10b981; color: white; padding: 10px 20px; border: none; margin: 10px; cursor: pointer; }
        @media print { .print-btn { display: none; } }
    </style>
</head>
<body>
    <button class="print-btn" onclick="window.print()">Stampa PDF</button>
    <div class="header">
        <h1 class="title">Lista Farmaci - PharmSpot</h1>
        <div class="info">Generato il ${currentDate} alle ${currentTime} - Totale: ${selectedFarmaci.length} farmaci</div>
    </div>`;

      // Aggiungi categorie
      Object.entries(farmaciByCategory).forEach(([category, farmaci]) => {
        htmlContent += `
    <div class="category">
        <div class="category-title">${category} (${farmaci.length} farmaci)</div>`;
        
        farmaci.forEach(farmaco => {
          htmlContent += `<div class="farmaco">${farmaco.name}</div>`;
        });
        
        htmlContent += `</div>`;
      });

      htmlContent += `</body></html>`;

      // Crea e scarica il file HTML
      const blob = new Blob([htmlContent], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `farmaci_${currentDate.replace(/\//g, '-')}.html`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      alert('File HTML generato e scaricato! Apri il file e usa Stampa > Salva come PDF dal browser.');
    } catch (error) {
      console.error('Errore nella generazione del file:', error);
      alert('Errore nella generazione del file. Riprova.');
    }
  };

  const createCategoryFromSelected = () => {
    if (selectedFarmaci.length === 0) {
      alert('Seleziona almeno un farmaco per creare una categoria');
      return;
    }
    
    try {
      const categoryName = window.prompt(`Inserisci il nome per la nuova categoria (${selectedFarmaci.length} farmaci):`);
      
      if (!categoryName || !categoryName.trim()) {
        return;
      }
      
      const trimmedName = categoryName.trim();
      
      // Verifica se esiste già
      if (farmaciData[trimmedName] || customCategories[trimmedName]) {
        alert(`La categoria "${trimmedName}" esiste già. Scegli un nome diverso.`);
        return;
      }

      // Crea array di nomi farmaci (senza duplicati)
      const farmaciNames = [...new Set(selectedFarmaci.map(f => f.name))];
      
      // Aggiorna le categorie custom
      setCustomCategories(prev => ({
        ...prev,
        [trimmedName]: farmaciNames
      }));
      
      alert(`Categoria "${trimmedName}" creata con successo con ${farmaciNames.length} farmaci!`);
      
      // Chiedi se passare alla nuova categoria
      if (window.confirm(`Vuoi visualizzare la nuova categoria "${trimmedName}"?`)) {
        setSelectedCategory(trimmedName);
      }
      
    } catch (error) {
      console.error('Errore nella creazione della categoria:', error);
      alert('Errore nella creazione della categoria. Riprova.');
    }
  };

  const editCustomCategory = (categoryName) => {
    try {
      const newName = window.prompt('Modifica nome categoria:', categoryName);
      if (!newName || !newName.trim() || newName.trim() === categoryName) {
        return;
      }
      
      const trimmedName = newName.trim();
      
      if (farmaciData[trimmedName] || customCategories[trimmedName]) {
        alert(`La categoria "${trimmedName}" esiste già`);
        return;
      }

      setCustomCategories(prev => {
        const updated = { ...prev };
        updated[trimmedName] = updated[categoryName];
        delete updated[categoryName];
        return updated;
      });
      
      if (selectedCategory === categoryName) {
        setSelectedCategory(trimmedName);
      }
      
      alert(`Categoria rinominata da "${categoryName}" a "${trimmedName}"`);
    } catch (error) {
      console.error('Errore nella modifica della categoria:', error);
      alert('Errore nella modifica della categoria. Riprova.');
    }
  };

  const deleteCustomCategory = (categoryName) => {
    try {
      const farmaciCount = customCategories[categoryName]?.length || 0;
      if (window.confirm(`Sei sicuro di voler eliminare la categoria "${categoryName}"? (${farmaciCount} farmaci)`)) {
        setCustomCategories(prev => {
          const updated = { ...prev };
          delete updated[categoryName];
          return updated;
        });
        
        if (selectedCategory === categoryName) {
          setSelectedCategory('Tutti');
        }
        
        alert(`Categoria "${categoryName}" eliminata`);
      }
    } catch (error) {
      console.error('Errore nell\'eliminazione della categoria:', error);
      alert('Errore nell\'eliminazione della categoria. Riprova.');
    }
  };

  const clearAllFarmaci = () => {
    try {
      if (window.confirm(`Sei sicuro di voler cancellare tutti i ${selectedFarmaci.length} farmaci selezionati?`)) {
        setSelectedFarmaci([]);
        alert('Lista farmaci cancellata!');
      }
    } catch (error) {
      console.error('Errore durante la cancellazione:', error);
      setSelectedFarmaci([]);
    }
  };

  return (
    <div className="h-screen bg-black text-white flex">
      {/* Sidebar sinistra */}
      <div className="w-64 bg-gray-900 flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-gray-700">
          <div className="flex items-center gap-2 mb-4">
            <Pill className="text-green-500" size={32} />
            <h1 className="text-xl font-bold">PharmSpot</h1>
          </div>
          
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
            <input
              type="text"
              placeholder="Cerca farmaci..."
              className="w-full bg-gray-800 rounded-full py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Categories */}
        <div className="flex-1 overflow-y-auto p-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Categorie</h2>
            {Object.keys(customCategories).length > 0 && (
              <span className="text-xs bg-blue-600 text-white px-2 py-1 rounded-full">
                {Object.keys(customCategories).length}
              </span>
            )}
          </div>
          <nav className="space-y-1">
            {categories.map((category) => (
              <div key={category} className="flex items-center group">
                <button
                  onClick={() => setSelectedCategory(category)}
                  className={`flex-1 text-left px-3 py-2 rounded-md text-sm transition-colors ${
                    selectedCategory === category
                      ? 'bg-green-600 text-white'
                      : 'text-gray-400 hover:text-white hover:bg-gray-800'
                  }`}
                >
                  {category}
                  {customCategories[category] && (
                    <span className="ml-2 text-xs bg-blue-500 text-white px-1.5 py-0.5 rounded">
                      Custom
                    </span>
                  )}
                </button>
                {customCategories[category] && (
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity ml-2 flex space-x-1">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        editCustomCategory(category);
                      }}
                      className="text-gray-400 hover:text-blue-400 transition-colors"
                      title="Modifica categoria"
                    >
                      <Edit3 size={14} />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteCustomCategory(category);
                      }}
                      className="text-gray-400 hover:text-red-400 transition-colors"
                      title="Elimina categoria"
                    >
                      <X size={14} />
                    </button>
                  </div>
                )}
              </div>
            ))}
          </nav>
        </div>
      </div>

      {/* Contenuto centrale */}
      <div className="flex-1 flex flex-col">
        {/* Header principale */}
        <div className="bg-gradient-to-b from-green-800 to-gray-900 p-8">
          <h1 className="text-4xl font-bold mb-2">
            {selectedCategory === 'Tutti' ? 'Tutti i Farmaci' : selectedCategory}
          </h1>
          <p className="text-gray-300">
            {filteredFarmaci.length} farmaci disponibili
            {searchTerm && ` (filtrati per "${searchTerm}")`}
          </p>
        </div>

        {/* Lista farmaci */}
        <div className="flex-1 bg-gray-900 p-6 overflow-y-auto">
          {filteredFarmaci.length === 0 ? (
            <div className="text-center text-gray-500 mt-16">
              <Search className="mx-auto mb-4 opacity-50" size={64} />
              <p className="text-xl mb-2">Nessun farmaco trovato</p>
              <p className="text-sm">
                {searchTerm 
                  ? `Nessun risultato per "${searchTerm}" nella categoria ${selectedCategory}`
                  : `Nessun farmaco disponibile nella categoria ${selectedCategory}`
                }
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredFarmaci.map((farmaco, index) => (
                <div
                  key={`${farmaco.name}-${index}`}
                  className="bg-gray-800 rounded-lg p-4 hover:bg-gray-700 transition-all duration-200 group cursor-pointer hover:shadow-lg hover:shadow-green-500/20 border border-transparent hover:border-green-500/30"
                  onClick={() => addFarmaco(farmaco)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="font-medium text-white mb-1">{farmaco.name}</h3>
                      <p className="text-sm text-gray-400">{farmaco.category}</p>
                    </div>
                    <Plus
                      className="text-gray-400 group-hover:text-green-500 transition-colors"
                      size={20}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Sidebar destra - Lista farmaci selezionati */}
      <div className="w-80 bg-gray-800 border-l border-gray-700 flex flex-col">
        <div className="p-6 border-b border-gray-700">
          <h2 className="text-xl font-bold mb-2">Lista Farmaci</h2>
          <p className="text-sm text-gray-400">
            {selectedFarmaci.length} farmaci selezionati
          </p>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {selectedFarmaci.length === 0 ? (
            <div className="text-center text-gray-500 mt-8">
              <Pill className="mx-auto mb-4 opacity-50" size={48} />
              <p>Nessun farmaco selezionato</p>
              <p className="text-sm">Clicca sui farmaci per aggiungerli</p>
            </div>
          ) : (
            <div className="space-y-2">
              {selectedFarmaci.map((farmaco) => (
                <div
                  key={farmaco.id}
                  className="bg-gray-700 rounded-lg p-3 flex items-center justify-between group hover:bg-gray-600 transition-colors"
                >
                  <div className="flex-1">
                    <h4 className="font-medium text-white text-sm">{farmaco.name}</h4>
                    <p className="text-xs text-gray-400">{farmaco.category}</p>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeFarmaco(farmaco.id);
                    }}
                    className="text-gray-400 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                  >
                    <X size={16} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {selectedFarmaci.length > 0 && (
          <div className="p-4 border-t border-gray-700 space-y-2">
            <button
              onClick={generatePDF}
              className="w-full bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-md transition-colors text-sm font-medium flex items-center justify-center gap-2"
            >
              <Download size={16} />
              Stampa PDF
            </button>
            <button
              onClick={createCategoryFromSelected}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md transition-colors text-sm font-medium flex items-center justify-center gap-2"
            >
              <FolderPlus size={16} />
              Crea Categoria
            </button>
            <button
              onClick={clearAllFarmaci}
              className="w-full bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-md transition-colors text-sm font-medium"
            >
              Cancella Tutto
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default FarmaciInterface;