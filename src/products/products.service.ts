import { Injectable, Logger } from "@nestjs/common";
import { LangChainService } from "src/langchain/langchain.service";
import * as fs from 'fs';
import * as Papa from 'papaparse'; // CSV parser library
import { InjectModel } from "@nestjs/mongoose";
import { Product } from "./schemas/product.schema";
import { Model } from "mongoose";
const { nanoid } = require('fix-esm').require('nanoid'); // Unique ID generator

/**
 * Service to manage product data operations such as importing and processing CSV files,
 * saving or updating products in the database, marking products for deletion,
 * and enhancing product descriptions.
 *
 * @class ProductsService
 */
@Injectable()
export class ProductsService {
    private readonly logger = new Logger(ProductsService.name);

    constructor(
        @InjectModel(Product.name) private readonly productModel: Model<Product>,
        private readonly langChainService: LangChainService
    ) { }

    /**
    * Parses a CSV file and returns an array of product data.
    * @param {string} filePath - The path to the CSV file.
    * @returns {Promise<any[]>} - A promise that resolves to an array of product data.
    */
    async parseCSV(filePath: string): Promise<any[]> {
        return new Promise((resolve, reject) => {
            const fileStream = fs.createReadStream(filePath, 'utf8');
            const results: any[] = [];

            Papa.parse(fileStream, {
                delimiter: ';',
                header: true,
                dynamicTyping: true,
                skipEmptyLines: true,
                transformHeader: (header) => header.trim() !== '' ? header : null,
                step: (row) => {
                    const filteredRow = Object.fromEntries(Object.entries(row.data).filter(([key]) => key !== null));
                    results.push(filteredRow);
                },
                complete: () => resolve(results),
                error: (error) => reject(error),
            });
        });
    }

    /**
     * Processes a CSV file containing product data, updates the database, and optionally deletes old products.
     * we are using the ProductID field as the unique identifier for products, because if we use docId there is no way to retrieve the docId from the CSV file.
     * @param {string} filePath - Path to the CSV file.
     * @param {boolean} performDeletion - Whether to delete products not in the new CSV.
     * @returns {Promise<void>} - A promise that resolves when the processing is complete.
     */
    async processCSV(filePath: string, performDeletion: boolean = false): Promise<void> {
        const csvData: any[] = await this.parseCSV(filePath);
        const productsMap = new Map();
        const importedProductIds: number[] = [];
        csvData.forEach((row) => {
            const {
                ProductID, ItemID, ProductName, ProductDescription, ManufacturerID,
                ManufacturerItemCode, ItemDescription, PKG, UnitPrice, QuantityOnHand, ItemImageURL, CategoryID
            } = row;

            if (typeof ProductID !== 'number') { // Skip rows with invalid ProductID
                return;
            }

            if (!productsMap.has(ProductID)) {
                productsMap.set(ProductID, {
                    _id: nanoid(),
                    docId: nanoid(),
                    fullDate: null,
                    productId: typeof ProductID == 'number' ? ProductID : Math.floor(100000 + Math.random() * 900000),
                    data: {
                        name: ProductName,
                        type: "non-inventory",
                        shortDescription: ItemDescription,
                        description: ProductDescription,
                        vendorId: nanoid(), // Simulating vendorId
                        manufacturerId: ManufacturerID,
                        storefrontPriceVisibility: "members-only",
                        variants: [],
                        options: [
                            {
                                id: nanoid(),
                                name: "description",
                                values: []
                            },
                            {
                                id: nanoid(),
                                name: "packaging",
                                values: []
                            }
                        ],
                        availability: "available",
                        isFragile: false,
                        published: "published",
                        isTaxable: true,
                        images: ItemImageURL ? [{ fileName: "", cdnLink: ItemImageURL, i: 0, alt: null }] : [],
                        categoryId: CategoryID
                    },
                    dataPublic: {},
                    immutable: false,
                    deploymentId: "d8039", // Simulating deploymentId
                    docType: "item",
                    namespace: "items",
                    companyId: nanoid(), // Simulating companyId
                    status: "active",
                    info: {
                        createdBy: nanoid(), // Simulating createdBy
                        createdAt: new Date().toISOString(),
                        updatedBy: nanoid(), // Simulating updatedBy
                        updatedAt: null,
                        deletedBy: null,
                        deletedAt: null,
                        dataSource: "csv",
                        companyStatus: "active",
                        transactionId: nanoid(), // Simulating transactionId
                        skipEvent: false,
                        userRequestId: nanoid() // Simulating userRequestId
                    }
                });
                importedProductIds.push(ProductID);
            }

            const unitPrice = this.parseAndValidateNumber(UnitPrice, ProductID);

            const product = productsMap.get(ProductID);
            product.data.variants.push({
                id: nanoid(),
                available: QuantityOnHand > 0,
                attributes: {
                    packaging: PKG,
                    description: ItemDescription,
                },
                cost: unitPrice,
                currency: "USD",
                description: ItemDescription,
                manufacturerItemCode: ManufacturerItemCode,
                manufacturerItemId: ItemID,
                packaging: PKG,
                price: parseFloat((unitPrice * 1.4).toFixed(4)),
                optionName: `${PKG}, ${ItemDescription}`,
                optionsPath: nanoid(), // Simulating optionsPath
                optionItemsPath: nanoid(), // Simulating optionItemsPath
                sku: `${ItemID}-${PKG}-${nanoid()}`, // Simulating SKU generation
                active: true,
                images: ItemImageURL ? [{ fileName: "", cdnLink: ItemImageURL, i: 0, alt: null }] : [],
                itemCode: ManufacturerItemCode
            });

        });
        const products = Array.from(productsMap.values());
        await this.saveOrUpdateProducts(products);

        // Perform deletion step only if the performDeletion is set to true
        if (performDeletion) {
            await this.markProductsForDeletion(importedProductIds);
        }
        // await this.enhanceProductsDescriptions(products);
        this.logger.log(`CSV processing completed. ${products.length} products processed.`);
    }

    /**
     * Saves or updates products in the database in batches.
     * @param {any[]} products - Array of product data to be saved or updated.
     * @returns {Promise<void>} - A promise that resolves when the operation is complete.
     */
    async saveOrUpdateProducts(products: any[]): Promise<void> {
        let { createdCount, updatedCount } = { createdCount: 0, updatedCount: 0 };
        for (const product of products) {
            const existingProduct = await this.productModel.findOne({ productId: product.productId });
            if (existingProduct) {
                // Update existing product
                const { _id, docId, productID, ...productWithoutId } = product;
                await this.productModel.updateOne({ productId: product.productId }, productWithoutId);
                updatedCount++;
            } else {
                // Insert new product
                await new this.productModel(product).save();
                createdCount++;
            }
            this.logger.log(`created: ${createdCount} products, updated: ${updatedCount} products out of ${products.length}.`)
        }
    }

    /**
     * Enhances the description of products using the LangChainService.
     * @param {any[]} products - Array of product data to enhance.
     * @returns {Promise<void>} - A promise that resolves when the operation is complete.
     */
    async enhanceProductsDescriptions(products: any[]): Promise<void> {
        const productsToEnhance = products.slice(0, 10);
        for (const product of productsToEnhance) {
            try {
                const enhancedDescription = await this.langChainService.enhanceDescription(product.data.name, product.data.description);
                await this.productModel.updateOne({ docId: product.docId }, { 'data.description': enhancedDescription });
                this.logger.log(`Enhanced description for product: ${product.data.name}`);
            } catch (error) {
                this.logger.error(`Error enhancing description for product ${product.data.name}: ${error.message}`);
            }
        }
    }

    /**
     * Marks products for deletion that are not present in the imported data.
     * @param {string[]} importedProductIds - Array of product IDs that were imported.
     * @returns {Promise<void>} - A promise that resolves when the operation is complete.
     */
    async markProductsForDeletion(importedProductIds: number[]): Promise<void> {
        try {
            const result = await this.productModel.updateMany(
                { 'productId': { $nin: importedProductIds } },
                { $set: { 'info.deletedAt': new Date().toISOString() } }
            );
            this.logger.log(`Marked ${result.modifiedCount} products as deleted`);
        } catch (error) {
            this.logger.error(`Error marking products for deletion: ${error.message}`);
            throw error;
        }
    }

    // Helper method to parse and validate a number from a string value.
    parseAndValidateNumber = (value: string, productID: number): number => {
        const number = parseFloat(value);
        if (isNaN(number)) {
            this.logger.log(`Invalid unitPrice "${value}" for product ID ${productID}. Using 0 as default.`);
            return 0;
        }
        return number;
    };

}