import fitz # Importeres som fitz
import os

def konverter_pdf_til_tekst(pdf_sti, utdata_mappe="utdata_tekst"):
    """Trekker ut tekst fra en PDF-fil."""
    try:
        # Åpne PDF-dokumentet
        doc = fitz.open(pdf_sti)
        full_tekst = ""
        
        # Iterer over hver side
        for side in doc:
            # Trekk ut tekst og legg til et linjeskift for separasjon
            full_tekst += side.get_text() + "\n\n"
        
        # Sikre at utdatamappen eksisterer
        if not os.path.exists(utdata_mappe):
            os.makedirs(utdata_mappe)
            
        # Lagre teksten i en ny .txt-fil
        filnavn_base = os.path.basename(pdf_sti).replace(".pdf", "")
        utdata_sti = os.path.join(utdata_mappe, f"{filnavn_base}.txt")
        
        with open(utdata_sti, "w", encoding="utf-8") as f:
            f.write(full_tekst)
            
        print(f"Konvertert: {pdf_sti} -> {utdata_sti}")
        return full_tekst
        
    except Exception as e:
        print(f"Feil ved konvertering av {pdf_sti}: {e}")
        return None

# Liste over PDF-filene dine
pdf_filer = ["bjorn.pdf", "rodrev.pdf", "gaupe.pdf", "snomus.pdf", "snougle.pdf"]

# Kjør konverteringen for alle filene
for fil in pdf_filer:
    # Anta at filene ligger i samme mappe som skriptet, eller spesifiser full sti
    konverter_pdf_til_tekst(fil)